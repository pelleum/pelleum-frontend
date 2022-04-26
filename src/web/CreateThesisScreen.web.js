// Installed Libraries
import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    TextInput,
    Image,
    TouchableOpacity,
    View,
} from "react-native";
import { HStack, VStack, NativeBaseProvider, Alert } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import SwitchSelector from "react-native-switch-selector";
// import { useAnalytics } from "@segment/analytics-react-native";

// Local Files
import CustomAlertModal from "../components/modals/CustomAlertModal";
import AddSourcesModal from "../components/modals/AddSourcesModal";
import AppText from "../components/AppText";
import ThesesManager from "../managers/ThesesManager";
import PostsManager from "../managers/PostsManager";
import RationalesManager from "../managers/RationalesManager";
import { useDispatch } from "react-redux";
import { addPost } from "../redux/actions/PostActions";
import {
    TEXT_COLOR,
    MAIN_DIFFERENTIATOR_COLOR,
    LIGHT_GREY_COLOR,
    MAIN_SECONDARY_COLOR,
    BAD_COLOR,
    BULL_SENTIMENT_BACKGROUND__COLOR,
    BEAR_SENTIMENT_BACKGROUND__COLOR,
    GOOD_COLOR,
    LIST_SEPARATOR_COLOR,
    CREATE_PLACEHOLDER_COLOR,
} from "../styles/Colors";
import {
    MAXIMUM_THESIS_CONTENT_CHARACTERS,
    MAXIMUM_THESIS_TITLE_CHARACTERS,
} from "../constants/ThesesConstants";

const CreateThesisScreen = ({ navigation, route }) => {
    // Universal State
    const dispatch = useDispatch();
    // Local State
    // Determine whether or not this screen is being used to create
    // or update a thesis. If it receives route params, it's used to update, else create
    const updatingThesis = route.params ? true : false;
    if (updatingThesis) {
        var [content, setContent] = useState(route.params.thesis.content);
        var [asset_symbol, setAssetSymbol] = useState(route.params.thesis.asset_symbol);
        var [title, setTitle] = useState(route.params.thesis.title);
        var [sentiment, setSentiment] = useState(route.params.thesis.sentiment);
        var [sources, setSources] = useState(route.params.thesis.sources);
        var [validSources, setValidSources] = useState(route.params.thesis.sources.filter((e) => e));
        var [inputValidity, setInputValidity] = useState({
            assetSymbolValidity: true,
            contentValidity: true,
            titleValidity: true,
        });
    } else {
        var [content, setContent] = useState("");
        var [asset_symbol, setAssetSymbol] = useState("");
        var [title, setTitle] = useState("");
        var [sentiment, setSentiment] = useState("Bull");
        var [sources, setSources] = useState(["", "", "", "", "", ""]);
        var [validSources, setValidSources] = useState([]);
        var [inputValidity, setInputValidity] = useState({
            assetSymbolValidity: false,
            contentValidity: false,
            titleValidity: false,
        });
    }
    const [hackValue, setHackValue] = useState(""); // A hack that gets the sources state variable to update
    const [disableStatus, setDisableStatus] = useState(true);
    const [discardDraft, setDiscardDraft] = useState(false);
    const [sourcesModalVisible, setSourcesModalVisible] = useState(false);
    const [unsavedChangesModalVisible, setUnsavedChangesModalVisible] = useState(false);
    const [duplicateTitleModalVisible, setDuplicateTitleModalVisible] = useState(false);
    const [unexpectedErrorModalVisible, setUnexpectedErrorModalVisible] = useState(false);
    const sentimentOptions = [
        { label: "Bull", value: "Bull" },
        { label: "Bear", value: "Bear" },
    ];

    // // Segment Tracking
    // const { track } = useAnalytics();

    const countSources = () => {
        // Executed when user exits the AddSourcesModal
        let newValidSources = [];
        sources.forEach((source, i) => {
            if (source) {
                newValidSources.push(source);
            }
        });
        setValidSources(newValidSources);
    };

    const handleChangeSource = (newValue, sourceNumber) => {
        // Executed when a source is changed in the (child) Modal
        const newSources = sources;
        newSources[sourceNumber - 1] = newValue;
        setSources(newSources);
        setHackValue(newValue);
    };

    const hasUnsavedChanges = (
        Boolean(content) ||
        Boolean(asset_symbol) ||
        Boolean(title)
    );

    // Alert user they have unsaved changes
    // https://reactnavigation.org/docs/preventing-going-back/
    useEffect(
        () =>
            navigation.addListener("beforeRemove", (e) => {
                if (!hasUnsavedChanges) {
                    // If we don't have unsaved changes, then we don't need to do anything
                    return;
                }

                // Prevent default behavior of leaving the screen
                e.preventDefault();

                //Prompt the user before leaving the screen
                setUnsavedChangesModalVisible(true);
            }),
        [navigation, hasUnsavedChanges]
    );

    useEffect(
        () => {
            if (discardDraft) {
                navigation.navigate("ProfileScreen")
            }
        },
        [discardDraft]
    );

    const handleAddRationale = async (createdThesis) => {
        const response = await RationalesManager.addRationale(createdThesis);
        if (response.status == 201) {
            // track("Rationale Added", {
            //     authorUserId: createdThesis.user_id,
            //     authorUsername: createdThesis.username,
            //     thesisId: createdThesis.thesis_id,
            //     assetSymbol: createdThesis.asset_symbol,
            //     sentiment: createdThesis.sentiment,
            //     sourcesQuantity: createdThesis.sources.length,
            //     organic: false,
            // });
        }
    };

    const createThesis = async () => {
        const createThesisResponse = await ThesesManager.createThesis({
            content,
            title,
            asset_symbol,
            sentiment,
            sources,
        });

        let createdThesis;

        if (createThesisResponse.status == 201) {
            createdThesis = createThesisResponse.data;
        } else if (createThesisResponse.status == 409) {
            setDuplicateTitleModalVisible(true);
        } else {
            setUnexpectedErrorModalVisible(true);
        }

        if (createdThesis) {
            // track("Thesis Created", {
            //     authorUserId: createdThesis.user_id,
            //     authorUsername: createdThesis.username,
            //     assetSymbol: createdThesis.asset_symbol,
            //     thesisId: createdThesis.thesis_id,
            //     sentiment: createdThesis.sentiment,
            //     sourcesQuantity: createdThesis.sources.length,
            //     organic: true,
            // });
            handleAddRationale(createdThesis);
            const createdPost = await PostsManager.createPost({
                content: `Just wrote a thesis on #${createdThesis.asset_symbol}! ✍️`,
                thesis_id: createdThesis.thesis_id,
            });
            if (createdPost) {
                createdPost.thesis = createdThesis;
                dispatch(addPost(createdPost));
                // track("Post Created", {
                //     authorUserId: createdPost.user_id,
                //     authorUsername: createdPost.username,
                //     assetSymbol: createdPost.asset_symbol,
                //     postId: createdPost.post_id,
                //     sentiment: createdPost.sentiment,
                //     postType: "feedPost",
                //     containsThesis: true,
                //     organic: false,
                // });
                setContent("");
                setAssetSymbol("");
                setTitle("");
                setSources(["", "", "", "", "", ""]);
                setDisableStatus(true);
                navigation.navigate("ProfileScreen");
            }
        }
    };

    const updateThesis = async (thesis) => {
        const updateThesisResponse = await ThesesManager.updateThesis({
            content,
            title,
            asset_symbol,
            sentiment,
            sources,
        }, thesis.thesis_id);

        if (updateThesisResponse.status == 200) {
            const updatedThesis = updateThesisResponse.data;
            setContent("");
            setAssetSymbol("");
            setTitle("");
            setSources(["", "", "", "", "", ""]);
            setDisableStatus(true);
            navigation.navigate("ThesisDetailScreen", { thesisId: updatedThesis.thesis_id });
        } else {
            setUnexpectedErrorModalVisible(true);
        }
    };

    const submitButtonPressed = async () => {
        // Executed when the 'Share' or 'Update' button is pressed

        // Remove empty strings from sources array
        const sources = validSources.filter((e) => e);

        if (updatingThesis) {
            await updateThesis(route.params.thesis);
        } else {
            await createThesis();
        }
    };

    const handleChangeText = ({
        newValue,
        checkContent = false,
        checkSymbol = false,
        checkTitle = false,
    } = {}) => {
        const newInputValidity = inputValidity;

        if (checkContent) {
            setContent(newValue);
            if (newValue.length < 1) {
                newInputValidity["contentValidity"] = false;
                setInputValidity(newInputValidity);
            } else {
                newInputValidity["contentValidity"] = true;
                setInputValidity(newInputValidity);
            }
        }

        if (checkSymbol) {
            setAssetSymbol(newValue);
            if (newValue.length < 1) {
                newInputValidity["assetSymbolValidity"] = false;
                setInputValidity(newInputValidity);
            } else {
                newInputValidity["assetSymbolValidity"] = true;
                setInputValidity(newInputValidity);
            }
        }

        if (checkTitle) {
            setTitle(newValue);
            if (newValue.length < 1) {
                newInputValidity["titleValidity"] = false;
                setInputValidity(newInputValidity);
            } else {
                newInputValidity["titleValidity"] = true;
                setInputValidity(newInputValidity);
            }
        }

        if (Object.values(inputValidity).every((item) => item === true)) {
            setDisableStatus(false);
        } else {
            setDisableStatus(true);
        }
    };

    return (
        <View style={styles.mainContainer}>
            <NativeBaseProvider>
                <AddSourcesModal
                    modalVisible={sourcesModalVisible}
                    makeModalDisappear={() => setSourcesModalVisible(false)}
                    hackValue={hackValue}
                    sources={sources}
                    changeSource={handleChangeSource}
                    tallySources={countSources}
                />
                <CustomAlertModal
                    modalVisible={unsavedChangesModalVisible}
                    makeModalDisappear={() => setUnsavedChangesModalVisible(false)}
                    alertTitle="You are about to exit this screen."
                    alertBody="Your thesis draft will not be saved. Are you sure you want to exit and discard your thesis draft?"
                    numberOfButtons={2}
                    firstButtonLabel="Cancel"
                    firstButtonStyle="cancel"
                    firstButtonAction={() => {
                        //do nothing and dismiss modal
                        setUnsavedChangesModalVisible(false);
                    }}
                    secondButtonLabel="Discard"
                    secondButtonStyle="destructive"
                    secondButtonAction={() => {
                        setAssetSymbol("");
                        setTitle("");
                        setContent("");
                        setDiscardDraft(true);
                        setUnsavedChangesModalVisible(false);
                    }}
                />
                <CustomAlertModal
                    modalVisible={duplicateTitleModalVisible}
                    makeModalDisappear={() => setDuplicateTitleModalVisible(false)}
                    alertTitle="You already have a thesis with this title."
                    alertBody="You cannot create multiple theses with the same title. Please update the title of this thesis."
                    numberOfButtons={1}
                    firstButtonLabel="OK"
                    firstButtonStyle="default"
                    firstButtonAction={() => {
                        //do nothing and dismiss modal
                        setDuplicateTitleModalVisible(false);
                    }}
                />
                <CustomAlertModal
                    modalVisible={unexpectedErrorModalVisible}
                    makeModalDisappear={() => setUnexpectedErrorModalVisible(false)}
                    alertTitle="An unexpected error occured."
                    alertBody="We apologize for the inconvenience. Please try again later."
                    numberOfButtons={1}
                    firstButtonLabel="OK"
                    firstButtonStyle="default"
                    firstButtonAction={() => {
                        //do nothing and dismiss modal
                        setUnexpectedErrorModalVisible(false);
                    }}
                />
                <VStack>
                    <View style={{ width: "100%" }}>
                        <HStack
                            alignItems="center"
                            justifyContent="space-between"
                            my="15"
                        >
                            <Image
                                style={styles.image}
                                source={require("../../assets/defaultProfileImage.png")}
                            />
                            <TouchableOpacity
                                style={
                                    disableStatus
                                        ? styles.shareButtonDisabled
                                        : styles.shareButtonEnabled
                                }
                                disabled={disableStatus}
                                onPress={() => {
                                    submitButtonPressed();
                                }}
                            >
                                {route.params ? (
                                    <AppText style={styles.buttonText}>Update</AppText>
                                ) : (
                                    <AppText style={styles.buttonText}>Share</AppText>
                                )}
                            </TouchableOpacity>
                        </HStack>
                        <TextInput
                            placeholder="Ex: GOOGL"
                            placeholderTextColor={CREATE_PLACEHOLDER_COLOR}
                            autoCorrect={false}
                            maxLength={5}
                            value={asset_symbol}
                            onChangeText={(newValue) =>
                                //toUpperCase has a bug on Android
                                //https://github.com/facebook/react-native/issues/27449
                                //https://github.com/facebook/react-native/issues/11068
                                //replace(/\s/g, "") forbids spaces
                                handleChangeText({ newValue: newValue.replace(/\s/g, "").toUpperCase(), checkSymbol: true })
                            }
                            autoCapitalize="characters"
                            style={styles.assetSymbolInput}
                        />
                        <AppText style={styles.labelText}>Ticker Symbol</AppText>
                        <TextInput
                            placeholder="Your Thesis Title"
                            placeholderTextColor={CREATE_PLACEHOLDER_COLOR}
                            value={title}
                            onChangeText={(newValue) =>
                                handleChangeText({ newValue: newValue, checkTitle: true })
                            }
                            style={styles.titleInput}
                            maxLength={MAXIMUM_THESIS_TITLE_CHARACTERS}
                            autoCorrect={true}
                        />
                        <AppText style={styles.labelText}>Thesis Title</AppText>
                        <TextInput
                            placeholder={
                                "An investment thesis is a well-thought-out rationale for a particular investment or investment strategy. In essence, why are you buying (or not buying) this asset?"
                            }
                            placeholderTextColor={CREATE_PLACEHOLDER_COLOR}
                            multiline={true}
                            style={styles.textArea}
                            maxLength={MAXIMUM_THESIS_CONTENT_CHARACTERS}
                            value={content}
                            onChangeText={(newValue) => {
                                handleChangeText({ newValue: newValue, checkContent: true });
                            }}
                        />
                    </View>
                    <HStack style={styles.hStack} alignItems="center">
                        <View style={styles.switchSelectorContainer}>
                            <SwitchSelector
                                options={sentimentOptions}
                                initial={sentiment == "Bull" ? 0 : 1}
                                onPress={(value) => {
                                    if (value === sentiment) {
                                        //do nothing
                                    } else {
                                        setSentiment(value);
                                    }
                                }}
                                height={40}
                                buttonColor={
                                    sentiment === "Bull"
                                        ? BULL_SENTIMENT_BACKGROUND__COLOR
                                        : BEAR_SENTIMENT_BACKGROUND__COLOR
                                }
                                textColor={sentiment === "Bull" ? BAD_COLOR : GOOD_COLOR}
                                borderColor={MAIN_DIFFERENTIATOR_COLOR}
                                backgroundColor={MAIN_DIFFERENTIATOR_COLOR}
                                selectedColor={sentiment === "Bull" ? GOOD_COLOR : BAD_COLOR}
                                fontSize={16}
                                bold={true}
                                hasPadding={true}
                            />
                        </View>
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() => setSourcesModalVisible(true)}
                        >
                            <MaterialIcons
                                name="add-link"
                                size={40}
                                color={MAIN_SECONDARY_COLOR}
                            />
                        </TouchableOpacity>
                        <AppText style={validSources.length > 0 ? styles.sourcesText : styles.noSourcesText}>
                            {validSources.length} linked sources
                        </AppText>
                    </HStack>
                </VStack>
            </NativeBaseProvider>
        </View>
    );
};

export default CreateThesisScreen;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        marginHorizontal: 15,
    },
    textArea: {
        color: TEXT_COLOR,
        marginTop: 20,
        borderBottomWidth: 0.5,
        borderBottomColor: LIST_SEPARATOR_COLOR,
        height: 225,
        textAlignVertical: "top",
        outlineStyle: 'none', //removes input outline in web browsers
    },
    image: {
        width: 44,
        height: 44,
        borderRadius: 44 / 2,
    },
    shareButtonEnabled: {
        backgroundColor: MAIN_SECONDARY_COLOR,
        borderRadius: 30,
        height: 35,
        width: 80,
        justifyContent: "center",
        alignItems: "center",
    },
    shareButtonDisabled: {
        backgroundColor: MAIN_SECONDARY_COLOR,
        borderRadius: 30,
        height: 35,
        width: 80,
        justifyContent: "center",
        alignItems: "center",
        opacity: 0.33,
    },
    buttonText: {
        color: "white",
    },
    iconButton: {
        marginLeft: 15,
    },
    switchSelectorContainer: {
        width: "40%",
        height: 45,
        alignSelf: "flex-start",
        justifyContent: "center",
    },
    hStack: {
        marginTop: 10,
    },
    assetSymbolInput: {
        color: TEXT_COLOR,
        paddingVertical: 5,
        borderBottomWidth: 0.5,
        borderBottomColor: LIST_SEPARATOR_COLOR,
        marginBottom: 5,
        width: "25%",
        outlineStyle: 'none', //removes input outline in web browsers
    },
    titleInput: {
        color: TEXT_COLOR,
        paddingVertical: 5,
        borderBottomWidth: 0.5,
        borderBottomColor: LIST_SEPARATOR_COLOR,
        marginTop: 10,
        marginBottom: 5,
        width: "100%",
        outlineStyle: 'none', //removes input outline in web browsers
    },
    labelText: {
        color: LIGHT_GREY_COLOR,
    },
    noSourcesText: {
        color: "#fcba03",
        marginLeft: 20,
    },
    sourcesText: {
        color: MAIN_SECONDARY_COLOR,
        marginLeft: 20,
    },
});