import React, { Component } from "react";
import { StyleSheet, Text, View, Button, Image, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permission from "expo-permissions";

export default class PickImage extends Component {
	state = {
		image: null,
	};

	getPermissionAsync = async () => {
		if (Platform.OS !== "web") {
			const { status } = await Permission.askAsync(Permission.CAMERA_ROLL);
			if (status !== "granted") {
				alert("Please provide a Permission for camera roll");
			}
		}
	};

	componentDidMount() {
		this.getPermissionAsync();
	}

	uploadImage = async (url) => {
		const data = new FormData();

		// getting the filename
		let fileName = url.split("/")[url.split("/").length - 1];
		let ext = `image/${url.split(".")[url.split(".").length - 1]}`;

		const fileToUpload = {
			uri: url,
			name: fileName,
			type: ext,
		};

		data.append("digit", fileToUpload);
		// console.log(data);
		fetch("https://0119-49-204-220-240.in.ngrok.io/predict-digit", {
			method: "POST",
			mode: "no-cors",
			body: data,
			headers: {
				"Content-Type": "multipart/form-data",
			},
		})
			.then((res) => {
				console.log(JSON.parse(res));
				res.json();
			})
			.then((result) => {
				console.log("success", result);
			})
			.catch((err) => {
				console.error(err);
			});
	};

	pickAnImage = async () => {
		try {
			let result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.All,
				allowsEditing: true,
				aspect: [4, 3],
				quality: 1,
			});
			if (!result.cancelled) {
				this.setState({
					image: result.data,
				});
				console.log(result.uri);
				this.uploadImage(result.uri);
			}
		} catch (error) {
			console.log(error);
		}
	};

	render() {
		let image = this.state;
		return (
			<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
				<Button title="Pick an Image" onPress={this.pickAnImage} />
			</View>
		);
	}
}
