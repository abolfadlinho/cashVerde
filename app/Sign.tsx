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
} from "react-native";
import { useAuth } from "../contexts/authProvider";
import { useRouter } from "expo-router";
import {
  signUpWithEmailAndPassword,
  doSignInWithEmailAndPassword,
} from "../firebase/auth";
import { Colors } from "@/constants/Colors";

const Sign = () => {
  const auth = useAuth();
  const router = useRouter();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [city, setCity] = useState("");
  const [neighbourhood, setNeighbourhood] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (auth?.userLoggedIn) {
      router.replace({ pathname: "/(tabs)/home" });
    } else {
      setLoading(false);
    }
  }, [auth?.userLoggedIn]);

  const handleAuth = async () => {
    setLoading(true);
    setError("");

    try {
      if (isSignUp) {
        await signUpWithEmailAndPassword(
          email,
          password,
          username,
          phone,
          dob,
          city,
          neighbourhood
        );
      } else {
        await doSignInWithEmailAndPassword(email, password);
      }
      router.replace({ pathname: "/(tabs)/home" });
    } catch (err) {
      setError((err as any).message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    //loading screen, should contain a logo or something
    return <View style={{ flex: 1, backgroundColor: Colors.primaryColor }} />;
  } else {
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
                <TextInput
                  style={styles.input}
                  placeholder="Date of Birth (YYYY-MM-DD)"
                  value={dob}
                  onChangeText={setDob}
                />
                <TextInput
                  style={styles.input}
                  placeholder="City"
                  value={city}
                  onChangeText={setCity}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Neighbourhood"
                  value={neighbourhood}
                  onChangeText={setNeighbourhood}
                />
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
              <Text style={{ color: Colors.primaryColor, marginTop: 10 }}>
                {isSignUp
                  ? "Already have an account? Sign In"
                  : "Don't have an account? Sign Up"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    );
  }
};

const styles = {
  input: {
    width: 300,
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  button: {
    width: 300,
    backgroundColor: Colors.primaryColor,
    padding: 15,
    borderRadius: 10,
    alignItems: "center" as "center",
  },
};

export default Sign;
