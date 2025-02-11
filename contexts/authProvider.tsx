import React, {
  useContext,
  useState,
  useEffect,
  createContext,
  ReactNode,
} from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";

export interface UserDetails {
  userId: string;
  username: string;
  email: string;
  phone: string;
  dob: Date;
  bankAccount: object;
  totalPoints: number;
  currentPoints: number;
  monthPoints: number;
  wallet: number;
  city: string;
  neighbourhood: string;
  voucherIds: string[];
  reported: boolean;
  communities: string[];
  createdAt: Date;
}

interface AuthContextType {
  userLoggedIn: boolean;
  user: User | null;
  userDetails: UserDetails | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  useEffect(() => {
    const authInstance = getAuth();
    const unsubscribeAuth = onAuthStateChanged(authInstance, (currentUser) => {
      if (currentUser) {
        setUserLoggedIn(true);
        setUser(currentUser);

        // Set up real-time listener for user details
        const userDocRef = doc(db, "users", currentUser.uid);
        const unsubscribeFirestore = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserDetails(docSnap.data() as UserDetails);
          } else {
            console.error("User document not found in Firestore");
            setUserDetails(null);
          }
        });

        return () => unsubscribeFirestore(); // Cleanup Firestore listener
      } else {
        setUserLoggedIn(false);
        setUser(null);
        setUserDetails(null);
      }
    });

    return () => unsubscribeAuth(); // Cleanup Auth listener
  }, []);

  return (
    <AuthContext.Provider value={{ userLoggedIn, user, userDetails }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface SetUserDetails {
  (userData: UserDetails): void;
}

export const setUserDetails: SetUserDetails = (userData) => {
  setUserDetails(userData); // Assuming this updates the context state
};
