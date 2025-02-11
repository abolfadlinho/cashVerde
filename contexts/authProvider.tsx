import React, {
  useContext,
  useState,
  useEffect,
  createContext,
  ReactNode,
} from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
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
    const unsubscribe = onAuthStateChanged(
      authInstance,
      async (currentUser) => {
        if (currentUser) {
          setUserLoggedIn(true);
          setUser(currentUser);

          // Fetch user details from Firestore
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            setUserDetails(userDocSnap.data() as UserDetails);
          } else {
            console.error("User document not found in Firestore");
          }
        } else {
          setUserLoggedIn(false);
          setUser(null);
          setUserDetails(null);
        }
      }
    );

    return () => unsubscribe();
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
