import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Button,
  StyleSheet,
} from "react-native";
import { useAuth } from "../contexts/authProvider";
import { useRouter } from "expo-router";
import {
  signUpWithEmailAndPassword,
  doSignInWithEmailAndPassword,
} from "../firebase/auth";
import { Colors } from "@/constants/Colors";
import DropdownSelect from "@/components/DropdownSelect";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import CheckBox from "@/components/CheckBox";
import InfoModal from "@/components/InfoModal";

const Sign = () => {
  const auth = useAuth();
  const router = useRouter();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedNeighbourhood, setSelectedNeighbourhood] = useState("");

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    const formattedDate = date.toISOString().split("T")[0];
    setDob(formattedDate);
    hideDatePicker();
  };

  const cities = [
    { label: "Cairo", value: "Cairo" },
    { label: "Alexandria", value: "Alexandria" },
    { label: "Giza", value: "Giza" },
    { label: "Shubra El Kheima", value: "Shubra El Kheima" },
    { label: "Port Said", value: "Port Said" },
    { label: "Suez", value: "Suez" },
    { label: "Mansoura", value: "Mansoura" },
    { label: "Tanta", value: "Tanta" },
    { label: "Aswan", value: "Aswan" },
    { label: "Ismailia", value: "Ismailia" },
    { label: "Fayoum", value: "Fayoum" },
    { label: "Minya", value: "Minya" },
    { label: "Beni Suef", value: "Beni Suef" },
    { label: "Damanhur", value: "Damanhur" },
    { label: "Qena", value: "Qena" },
    { label: "Luxor", value: "Luxor" },
    { label: "Zagazig", value: "Zagazig" },
    { label: "Kafr El Sheikh", value: "Kafr El Sheikh" },
    { label: "Sadat City", value: "Sadat City" },
    { label: "6th of October", value: "6th of October" },
  ];

  const cairoNeighbourhoods = [
    { label: "Heliopolis", value: "Heliopolis" },
    { label: "Nasr City", value: "Nasr City" },
    { label: "Maadi", value: "Maadi" },
    { label: "Zamalek", value: "Zamalek" },
    { label: "New Cairo", value: "New Cairo" },
    { label: "Sheikh Zayed", value: "Sheikh Zayed" },
    { label: "Garden City", value: "Garden City" },
    { label: "Mohandessin", value: "Mohandessin" },
    { label: "6th of October", value: "6th of October" },
    { label: "Dokki", value: "Dokki" },
    { label: "Shorouk", value: "Shorouk" },
  ];

  const alexNeighbourhoods = [
    { label: "Roshdy", value: "Roshdy" },
    { label: "Stanley", value: "Stanley" },
    { label: "Sidi Bishr", value: "Sidi Bishr" },
    { label: "Smouha", value: "Smouha" },
    { label: "Moharam Bek", value: "Moharam Bek" },
    { label: "Kornish", value: "Kornish" },
    { label: "Montaza", value: "Montaza" },
    { label: "Gleem", value: "Gleem" },
    { label: "Kafr Abdu", value: "Kafr Abdu" },
    { label: "Culbertson", value: "Culbertson" },
  ];

  const [isTermsChecked, setIsTermsChecked] = useState(false);

  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsTermsChecked(e.target.checked);
  };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (auth?.userLoggedIn) {
      router.replace({ pathname: "/(tabs)/home" });
    } else {
      setLoading(false);
    }
  }, [auth?.userLoggedIn]);

  interface dobObject {
    day: string;
    month: string;
    year: string;
  }

  const handleDobChange = (dob: dobObject) => {
    setDob(dob.year + "-" + dob.month + "-" + dob.day);
  };

  const handleAuth = async () => {
    setLoading(true);
    setError("");

    try {
      if (isSignUp) {
        if (
          !email ||
          !password ||
          !username ||
          !phone ||
          !dob ||
          !selectedCity
        ) {
          setError("Please fill in all required fields.");
          setLoading(false);
          return;
        }
        if (
          (selectedCity === "Cairo" || selectedCity === "Alexandria") &&
          !selectedNeighbourhood
        ) {
          setError("Please select a neighbourhood.");
          setLoading(false);
          return;
        }
        if (!isTermsChecked) {
          setError("Please agree to the terms and conditions.");
          setLoading(false);
          return;
        }
        await signUpWithEmailAndPassword(
          email,
          password,
          username,
          phone,
          dob,
          selectedCity,
          selectedNeighbourhood
        );
      } else {
        if (!email || !password) {
          setError("Please fill in all required fields.");
          setLoading(false);
          return;
        }
        await doSignInWithEmailAndPassword(email, password);
      }
      router.replace({ pathname: "/(tabs)/home" });
    } catch (err) {
      const errorCode = (err as any).code;
      if (errorCode === "auth/email-already-in-use") {
        setError("This email is already in use. Please use a different email.");
      } else {
        setError((err as any).message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
            backgroundColor: Colors.whiteColor,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              color: Colors.primaryColor,
              marginBottom: 20,
            }}
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {isSignUp && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
              />
              <TextInput
                style={styles.input}
                placeholder="Phone"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
              <TouchableOpacity
                onPress={showDatePicker}
                style={styles.dateInput}
              >
                <Text style={styles.dateSelectTitle}>
                  --Select Date Of Birth--
                </Text>
                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  onConfirm={handleConfirm}
                  onCancel={hideDatePicker}
                />
                {dob != "" && <Text style={styles.selectedDate}>{dob}</Text>}
              </TouchableOpacity>
              <DropdownSelect
                label="--Choose a City--"
                options={cities}
                value={selectedCity}
                onChange={(value) => setSelectedCity(value.toString())}
              />
              {selectedCity === "Cairo" && (
                <DropdownSelect
                  label="--Choose a Neighbourhood--"
                  options={cairoNeighbourhoods}
                  value={selectedNeighbourhood}
                  onChange={(value) =>
                    setSelectedNeighbourhood(value.toString())
                  }
                />
              )}
              {selectedCity === "Alexandria" && (
                <DropdownSelect
                  label="--Choose a Neighbourhood--"
                  options={alexNeighbourhoods}
                  value={selectedNeighbourhood}
                  onChange={(value) =>
                    setSelectedNeighbourhood(value.toString())
                  }
                />
              )}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: 30,
                }}
              >
                <CheckBox
                  label=""
                  value={isTermsChecked}
                  onValueChange={setIsTermsChecked}
                />
                <Text style={{ flexDirection: "row" }}>I agree to the </Text>
                <TouchableOpacity
                  onPress={() => {
                    setInfoModalVisible(true);
                  }}
                >
                  <Text style={{ color: "blue" }}>Terms and Conditions</Text>
                </TouchableOpacity>
                <InfoModal
                  visible={infoModalVisible}
                  onClose={() => setInfoModalVisible(false)}
                  title="Terms and Conditions"
                  content={Colors.loremIpsum}
                />
              </View>
            </>
          )}

          {error ? (
            <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>
          ) : null}

          <TouchableOpacity onPress={handleAuth} style={styles.button}>
            <Text style={{ color: "#fff", fontSize: 16 }}>
              {isSignUp ? "Sign Up" : "Sign In"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
            <Text style={{ color: Colors.greenText, marginTop: 10 }}>
              {isSignUp
                ? "Already have an account? Sign In"
                : "Don't have an account? Sign Up"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  input: {
    width: 300,
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  dateInput: {
    width: 300,
    height: 80,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 300,
    backgroundColor: Colors.primaryColor,
    padding: 15,
    borderRadius: 10,
    alignItems: "center" as "center",
  },
  selectedDate: {
    padding: 5,
    fontSize: 16,
    fontStyle: "italic",
  },
  dateSelectTitle: {
    padding: 5,
    fontSize: 16,
    color: Colors.greenText,
  },
});

export default Sign;
