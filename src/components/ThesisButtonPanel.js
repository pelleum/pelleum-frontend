import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { HStack, NativeBaseProvider } from "native-base";
import { AntDesign, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import ThesesManager from "../managers/ThesesManager";
import RationalesManager from "../managers/RationalesManager";
import { ReactionType } from "../redux/actions/ThesisReactionsActions";
import { useSelector } from "react-redux";

const ThesisButtonPanel = ({ item }) => {
	const state = useSelector((state) => state.thesisReactionsReducer);
	const { rationaleLibrary } = useSelector((state) => state.rationaleReducer)

	const thesisIsLiked =
		(item.user_reaction_value == 1 &&
			!state.locallyUnlikedTheses.includes(item.thesis_id) &&
			!state.locallyDislikedTheses.includes(item.thesis_id) &&
			!state.locallyRemovedDislikedTheses.includes(item.thesis_id)) ||
		state.locallyLikedTheses.includes(item.thesis_id);

	const thesisIsDisliked =
		(item.user_reaction_value == -1 &&
			!state.locallyRemovedDislikedTheses.includes(item.thesis_id) &&
			!state.locallyLikedTheses.includes(item.thesis_id) &&
			!state.locallyUnlikedTheses.includes(item.thesis_id)) ||
		state.locallyDislikedTheses.includes(item.thesis_id);

	return (
		<NativeBaseProvider>
			<HStack style={styles.buttonBox}>
				<TouchableOpacity
					style={styles.iconButton}
					onPress={() => ThesesManager.sendThesisReaction(item, ReactionType.Like)}
				>
					<AntDesign
						name={thesisIsLiked ? "like1" : "like2"}
						size={24}
						color={thesisIsLiked ? "#F82057" : "#00A8FC"}
					/>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.iconButton}
					onPress={() => ThesesManager.sendThesisReaction(item, ReactionType.Dislike)}
				>
					<AntDesign
						name={thesisIsDisliked ? "dislike1" : "dislike2"}
						size={24}
						color={thesisIsDisliked ? "#F82057" : "#00A8FC"}
					/>
				</TouchableOpacity>
				<TouchableOpacity
					style={rationaleLibrary.some(rationale => rationale.thesisID === item.thesis_id) ? styles.disabledIconButton : styles.iconButton}
					onPress={() => RationalesManager.addRationale(item)}
					disabled={rationaleLibrary.some(rationale => rationale.thesisID === item.thesis_id) ? true : false}
				>
					<MaterialIcons name="post-add" size={27} color="#00A8FC" />
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.iconButton}
					onPress={() => {
						console.log("Share button worked.");
					}}
				>
					<FontAwesome name="send-o" size={19} color="#00A8FC" />
				</TouchableOpacity>
			</HStack>
		</NativeBaseProvider>
	);
};

export default ThesisButtonPanel;

const styles = StyleSheet.create({
	buttonBox: {
		paddingTop: 5,
		alignSelf: "center",
		alignItems: "center",
		width: "92%",
		flexDirection: "row",
		justifyContent: "space-between",
	},
	iconButton: {
		paddingHorizontal: 13,
		paddingTop: 8,
	},
	disabledIconButton: {
		paddingHorizontal: 13,
		paddingTop: 8,
		opacity: 0.33
	},
});