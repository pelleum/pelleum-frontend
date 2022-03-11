import React, {useEffect, useState} from 'react'
import { Platform, StyleSheet } from 'react-native';
import RNIap, {
    purchaseErrorListener,
    purchaseUpdatedListener,
    finishTransaction,
} from 'react-native-iap';
import { useSelector, useDispatch } from 'react-redux'
import { subscriptionChange } from "../redux/actions/AuthActions"


const itemSubs = Platform.select({
    ios: [''],
    android: ['']
})
let purchaseUpdateSubscription
let purchaseErrorSubscription

const SubscriptionScreen = ({}) => {

    const { subscriptionObject } = useSelector((state) => state.authReducer)
    const dispatch = useDispatch()

    const [subscriptionList, setSubscriptionList] = useState([])
    const [receipt, setReceipt] = useState('')

    useEffect(() => {
        try {
            await RNIap.initConnection()
            if (Platform.OS == 'android') {
                await RNIap.flushFailedPurchasesCachedAsPendingAndroid()
            } else {
                await RNIap.clearTransactionIOS()
            }
        } catch (err) {
            console.warn(err.code, err.message)
        }

        purchaseUpdateSubscription = purchaseUpdatedListener(
            async (purchase) => {
                const receipt = puchase.transactionReceipt
                ? purchase.transactionReceipt
                : purchase.originalJson
                if (receipt) {
                    setReceipt(purchase.transactionReceipt)
                    purchaseConfirmed()
                    try {
                        const ackResult = await finishTransaction(purchase, false)
                    } catch (ackErr) {
                        console.warn('ackErr', ackErr)
                    }
                }
            }
        )

        purchaseErrorSubscription = purchaseErrorListener(
            (error) => {
                console.log('purchaseErrorListener', error)
            }
        )

        return () => {
            if (purchaseUpdateSubscription) {
                purchaseUpdateSubscription.remove()
                purchaseUpdateSubscription = null
            }

            if (purchaseErrorSubscription) {
                purchaseErrorSubscription.remove()
                purchaseErrorSubscription = null
            }
            
            RNIap.endConnection()
        }
    }, [])

    getSubscriptions = async () => {
        try {
            const subscriptions = await RNIap.getSubscriptions(itemSubs)
            setSubscriptionList(subscriptions)
        } catch (err) {
            console.log('getSubscriptions error => ', err)
        }
    }

    requestSubscription = async (sku) => {
        try {
            await RNIap.requestSubscription(sku)
        } catch (err) {
            console.log('requestSubscription error => ', err)
        }
    }

    purchaseConfirmed = () => {
        // send details to backend
        dispatch(subscriptionChange({
            subscriptionName: 'PRO',
            isActive: true
        }))
    }

    return (
        <View style={styles.mainContainer}>
            {subscriptionObject.isActive ? 
                <Text>
                    Subscribed to PRO already
                </Text> : 
                <ScrollView style={{alignSelf: 'stretch'}}>
                    <View style={{height: 50}} />
                    <NativeButton
                        onPress={() => getSubscriptions()}
                        activeOpacity={0.5}
                        style={styles.button}
                        textStyle={styles.buttonTextSyle}
                    >
                        Get available subscriptions
                    </NativeButton>
                    {subscriptionList.map((subscription, i) => {
                        return (
                            <View
                                key={i}
                                style={{
                                    flexDirection: 'column',
                                }}
                            >
                                <Text
                                    style={{
                                    marginTop: 20,
                                    fontSize: 12,
                                    color: 'black',
                                    minHeight: 100,
                                    alignSelf: 'center',
                                    paddingHorizontal: 20,
                                    }}
                                >
                                    {JSON.stringify(subscription)}
                                </Text>
                                <NativeButton
                                    onPress={() =>
                                        requestSubscription(subscription.subscriptionId)
                                    }
                                    activeOpacity={0.5}
                                    style={styles.button}
                                    textStyle={styles.buttonTextSyle}
                                >
                                    Request purchase for above subscription
                                </NativeButton>
                            </View>
                        );
                    })}
                </ScrollView>     
            }   
        </View>
    )
}

export default SubscriptionScreen

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    buttonTextSyle: {
        color: "white",
		fontWeight: "bold",
		textAlign: "center",
		fontSize: 15,
    },
    button: {
        alignSelf: "center",
		borderRadius: 30,
		padding: 11,
		marginTop: 30,
		width: "84%",
		backgroundColor: MAIN_SECONDARY_COLOR,
		elevation: 2,
    }
})