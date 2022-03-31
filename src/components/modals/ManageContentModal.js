import React from "react";
import { Modal, StyleSheet, View, TouchableOpacity } from "react-native";
import {
	MAIN_DIFFERENTIATOR_COLOR,
	LIGHT_GREY_COLOR,
	MAIN_SECONDARY_COLOR,
} from "../../styles/Colors";
import AppText from "../AppText";
import * as Linking from "expo-linking";
import { Ionicons, Entypo, Octicons, FontAwesome } from "@expo/vector-icons";
import { HStack, NativeBaseProvider } from "native-base";
import { useAnalytics } from "@segment/analytics-react-native";

const ManageContentModal = ({
	modalVisible,
	makeModalDisappear,
	userId,
	item,
	deleteContent,
	blockUser,
	editContent,
}) => {
	// Segment Tracking
	const { track } = useAnalytics();

	const handleReporting = (emailLink) => {
		Linking.openURL(emailLink);
		if (!item.hasOwnProperty("post_id")) {
			track("Thesis Reported", {
				authorUserId: item.user_id,
				authorUsername: item.username,
				thesisId: item.thesis_id,
				assetSymbol: item.asset_symbol,
				sentiment: item.sentiment,
				sourcesQuantity: thesis.sources.length,
			});
		} else {
			const postType =
				item.is_post_comment_on || item.is_thesis_comment_on
					? "comment"
					: "feedPost";
			track("Post Reported", {
				authorUserId: item.user_id,
				authorUsername: item.username,
				postId: item.post_id,
				assetSymbol: item.asset_symbol,
				sentiment: item.sentiment,
				postType: postType,
			});
		}
	};

	return (
		<NativeBaseProvider>
			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => {
					setModalVisible(!modalVisible);
				}}
			>
				<TouchableOpacity
					style={styles.centeredView}
					onPress={() => {
						makeModalDisappear();
					}}
				>
					<TouchableOpacity onPress={() => {}} activeOpacity={1}>
						<View style={styles.modalView}>
							<View style={styles.buttonContainer}>
								{userId == item.user_id ? (
									<>
										{!item.hasOwnProperty("post_id") ? (
											<TouchableOpacity
												style={styles.button}
												onPress={() => {
													makeModalDisappear();
													editContent(item);
												}}
											>
												<HStack>
													<FontAwesome
														name="edit"
														size={16}
														color={MAIN_SECONDARY_COLOR}
													/>
													<AppText style={styles.buttonText}>Edit</AppText>
												</HStack>
											</TouchableOpacity>
										) : null}
										<TouchableOpacity
											style={styles.button}
											onPress={() => {
												makeModalDisappear();
												deleteContent(item);
											}}
										>
											<HStack>
												<Ionicons
													name="trash-outline"
													size={16}
													color={MAIN_SECONDARY_COLOR}
												/>
												<AppText style={styles.buttonText}>Delete</AppText>
											</HStack>
										</TouchableOpacity>
									</>
								) : (
									<>
										<TouchableOpacity
											style={styles.button}
											onPress={() => {
												makeModalDisappear();
												blockUser(item);
											}}
										>
											<HStack>
												<Entypo
													name="block"
													size={16}
													color={MAIN_SECONDARY_COLOR}
												/>
												<AppText style={styles.buttonText}>
													Block @{item.username}
												</AppText>
											</HStack>
										</TouchableOpacity>
										<TouchableOpacity
											style={styles.button}
											onPress={() => {
												makeModalDisappear();
												handleReporting(
													`mailto:tos@pelleum.com?subject=Report Objectionable Content by @${item.username} &body=Please describe why this user's content is abusive, threatening, or infringing on someone's rights:\n\n\n\n---\n\nUser: @${item.username}\nContent: ${item.content}`
												);
											}}
										>
											<HStack>
												<Octicons
													name="stop"
													size={16}
													color={MAIN_SECONDARY_COLOR}
												/>
												<AppText style={styles.buttonText}>
													Report Content
												</AppText>
											</HStack>
										</TouchableOpacity>
									</>
								)}
							</View>
						</View>
					</TouchableOpacity>
				</TouchableOpacity>
			</Modal>
		</NativeBaseProvider>
	);
};

export default ManageContentModal;

const styles = StyleSheet.create({
	centeredView: {
		marginTop: 22,
		flex: 1,
		flexDirection: "column",
		justifyContent: "flex-end",
	},
	modalView: {
		margin: 20,
		backgroundColor: MAIN_DIFFERENTIATOR_COLOR,
		borderRadius: 20,
		padding: 35,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	buttonText: {
		color: LIGHT_GREY_COLOR,
		fontSize: 16,
		marginLeft: 15,
	},
	button: {
		alignItems: "center",
		justifyContent: "center",
		width: "100%",
		height: 45,
	},
	buttonContainer: {
		alignItems: "flex-start",
	},
});
