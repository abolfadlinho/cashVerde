import { db } from "./firebase";
import { collection, addDoc, getDoc, getDocs, updateDoc, deleteDoc, doc, query, where, arrayUnion, writeBatch, increment } from "firebase/firestore";

// Collection references
const adminsRef = collection(db, "admins");
const usersRef = collection(db, "users");
const chatsRef = collection(db, "chats");
const machinesRef = collection(db, "machines");
const maintenancesRef = collection(db, "maintenances");
const communitiesRef = collection(db, "communities");
const vouchersRef = collection(db, "vouchers");
const getCollectionRef = (name) => collection(db, name);

const createUser = async (data) => {
  try {
    const docRef = await addDoc(usersRef, data);
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

const getMachinesForDisplay = async () => {
  try {
    const querySnapshot = await getDocs(machinesRef);
    const now = new Date();
    const threeDaysLater = new Date();
    threeDaysLater.setDate(now.getDate() + 3);

    // Fetch maintenance records
    const maintenanceSnapshot = await getDocs(maintenancesRef);
    const maintenances = maintenanceSnapshot.docs.map(doc => ({
      machineId: doc.data().machineId,
      date: doc.data().date ? doc.data().date.toDate() : null,
      notes: doc.data().notes,
    }));

    const machines = querySnapshot.docs
      .map((doc) => {
        const data = doc.data();

        // Skip inactive machines
        if (!data.active) return null;

        const location = data.location;
        let longitude = null;
        let latitude = null;

        // Extract latitude and longitude from location URL
        const match = location.match(/q=(-?\d+\.\d+),(-?\d+\.\d+)/);
        if (match) {
          latitude = parseFloat(match[1]);
          longitude = parseFloat(match[2]);
        }

        // Find all maintenance records for the machine within the next 3 days
        const upcomingMaintenances = maintenances
          .filter(m => 
            m.machineId === doc.id && 
            m.date && 
            m.date >= now && 
            m.date <= threeDaysLater
          )
          .sort((a, b) => a.date - b.date); // Sort by date in ascending order

        // Select the nearest upcoming maintenance (if available)
        const nearestMaintenance = upcomingMaintenances.length > 0 ? upcomingMaintenances[0] : null;

        return {
          id: doc.id,
          name: data.name,
          longitude,
          latitude,
          notes: data.notes,
          active: data.active,
          createdAt: data.createdAt ? data.createdAt.toDate() : null,
          maintenance: nearestMaintenance 
            ? { date: nearestMaintenance.date, notes: nearestMaintenance.notes } 
            : null,
        };
      })
      .filter(machine => machine !== null); // Remove null values (inactive machines)

    return machines;
  } catch (error) {
    console.error("Error fetching machines:", error);
    throw error;
  }
};

const setBankAccount = async (userId, bankAccount) => {
  try {
    const userRef = doc(usersRef, userId);
    await updateDoc(userRef, {
      bankAccount
    });
    return { bankAccount };
  } catch (error) {
    console.error("Error fetching machines:", error);
    throw error;
  }
}

const getMaintenanceLog = async () => {
  try {
    const querySnapshot = await getDocs(machinesRef);
    const now = new Date();

    // Fetch maintenance records
    const maintenanceSnapshot = await getDocs(maintenancesRef);
    const maintenances = maintenanceSnapshot.docs.map(doc => ({
      machineId: doc.data().machineId,
      date: doc.data().date ? doc.data().date.toDate() : null,
      notes: doc.data().notes,
    }));

    const machines = querySnapshot.docs
      .map((doc) => {
        const data = doc.data();

        // Skip inactive machines
        if (!data.active) return null;

        const location = data.location;
        let longitude = null;
        let latitude = null;

        // Extract latitude and longitude from location URL
        const match = location.match(/q=(-?\d+\.\d+),(-?\d+\.\d+)/);
        if (match) {
          latitude = parseFloat(match[1]);
          longitude = parseFloat(match[2]);
        }

        // Find all maintenance records for the machine within the next 3 days
        const upcomingMaintenances = maintenances
          .filter(m => 
            m.machineId === doc.id && 
            m.date && 
            m.date >= now
          )
          .sort((a, b) => a.date - b.date); // Sort by date in ascending order

        return {
          id: doc.id,
          name: data.name,
          longitude,
          latitude,
          notes: data.notes,
          active: data.active,
          createdAt: data.createdAt ? data.createdAt.toDate() : null,
          maintenance: upcomingMaintenances.length > 0 
            ? upcomingMaintenances.map(m => ({ date: m.date, notes: m.notes }))
            : null,
        };
      })
      .filter(machine => machine?.maintenance !== null)
      .filter(machine => machine !== null ); // Remove null values (inactive machines)

    return machines;
  } catch (error) {
    console.error("Error fetching machines:", error);
    throw error;
  }
};


const fetchVouchers = async () => {
  try {
    const querySnapshot = await getDocs(vouchersRef);
    const vouchers = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return vouchers;
  } catch (error) {
    console.error("Error fetching vouchers:", error);
    throw error;
  }
};

const fetchCommunitiesUingIds = async (ids) => {
  try {
    const communities = [];
    for (const id of ids) {
      const docSnap = await getDoc(doc(communitiesRef, id));
      if (docSnap.exists()) {
        communities.push({ id: docSnap.id, ...docSnap.data() });
      }
    }
    return communities;
  } catch (error) {
    console.error("Error fetching communities:", error);
    throw error;
  }
};

const createCommunity = async (owner, name) => {
  try {
    const createdAt = new Date();
    const code = generateCode();
    const docRef = await addDoc(communitiesRef, { owner, name, createdAt, code});
    const userRef = doc(db, "users", owner);
    await updateDoc(userRef, {
      communities: arrayUnion(docRef.id)
    });
    return { id: docRef.id, owner, name, createdAt, code};
  } catch (error) {
    console.error("Error creating community:", error);
    throw error;
  }
}

const joinCommunityUsingCode = async (userId, code) => {
  try {
    const q = query(communitiesRef, where("code", "==", code));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      throw new Error("Community not found");
    }
    const community = querySnapshot.docs[0].data();
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      communities: arrayUnion(querySnapshot.docs[0].id)
    });
    return { id: querySnapshot.docs[0].id, name: community.name, owner: community.owner, createdAt: community.createdAt, code: community.code};
  } catch (error) {
    console.error("Error fetching community by code:", error);
    throw error;
  }
}

const getUserRank = async (userMonthPoints, fieldName, fieldValue) => {
  try {
    let q;

    if (fieldName === "community") {
      q = query(usersRef, where("communities", "array-contains", fieldValue));
    } else if (fieldName === "year") {
      q = query(usersRef, where("dob", ">=", `${fieldValue}-01-01`), where("dob", "<=", `${fieldValue}-12-31`));
    } else if (fieldName === "neighbourhood") {
      q = query(usersRef, where("neighbourhood", "==", fieldValue));
    } else if (fieldName === "city") {
      q = query(usersRef, where("city", "==", fieldValue));
    } else {
      q = query(usersRef);
    }

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return 1;
    }

    const users = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        monthPoints: doc.data().monthPoints,
      }))
      .sort((a, b) => b.monthPoints - a.monthPoints);

    const rank = users.findIndex(user => user.monthPoints <= userMonthPoints) + 1;

    return rank;

  } catch (error) {
    console.error("Error fetching user rank:", error);
    return -1;
  }
};

const getLeaderboard = async (communityId, fieldValue, fieldName) => {
  try {
    const q = query(usersRef, where("communities", "array-contains", communityId));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return [];
    }

    let users = querySnapshot.docs.map((doc) => ({
        userId: doc.id,
        monthPoints: doc.data().monthPoints,
        username: doc.data().username,
        rank: 0,
      }))
      .sort((a, b) => b.monthPoints - a.monthPoints);

    let rank = 1;
    let prevPoints = null;
    let prevRank = 1;

    users = users.map((user, index) => {
      if (user.monthPoints !== prevPoints) {
        rank = index + 1;
        prevRank = rank;
      } else {
        rank = prevRank;
      }
      prevPoints = user.monthPoints;

      return { ...user, rank };
    });

    return users;

  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }
}

function generateCode()  {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const getPublicLeaderboard = async (fieldName, fieldValue) => {
  try {
    let q;

    if (fieldName === "community") {
      q = query(usersRef, where("communities", "array-contains", fieldValue));
    } else if (fieldName === "year") {
      q = query(usersRef, where("dob", ">=", `${fieldValue}-01-01`), where("dob", "<=", `${fieldValue}-12-31`));
    } else if (fieldName === "neighbourhood") {
      q = query(usersRef, where("neighbourhood", "==", fieldValue));
    } else if (fieldName === "city") {
      q = query(usersRef, where("city", "==", fieldValue));
    } else {
      q = query(usersRef);
    }

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return [];
    }

    let users = querySnapshot.docs.map((doc) => ({
        userId: doc.id,
        monthPoints: doc.data().monthPoints,
        username: doc.data().username,
        rank: 0,
      }))
      .sort((a, b) => b.monthPoints - a.monthPoints);

    let rank = 1;
    let prevPoints = null;
    let prevRank = 1;

    users = users.map((user, index) => {
      if (user.monthPoints !== prevPoints) {
        rank = index + 1;
        prevRank = rank;
      } else {
        rank = prevRank;
      }
      prevPoints = user.monthPoints;

      return { ...user, rank };
    });

    return users;

  } catch (error) {
    console.error("Error fetching user rank:", error);
    return [];
  }
};

const getUserProfile = async (userId) => {
  try {
    const docSnap = await getDoc(doc(usersRef, userId));
    if (!docSnap.exists()) {
      throw new Error("User not found");
    }
    return { id: docSnap.id, ...docSnap.data() };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

const resetUsersMonthPoints = async () => {
    console.log('Start of the month task is running...');
    try {
      const querySnapshot = await getDocs(usersRef);
      if (querySnapshot.empty) {
        return;
      }
  
      const users = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          monthPoints: doc.data().monthPoints,
        }));
  
      for (const user of users) {
        await updateDoc(doc(usersRef, user.id), {
          monthPoints: 0
        });
      }
      return;
    } catch (error) {
      console.error("Error resetting users' month points:", error);
      return;
    }
  }

const redeemVoucher = async (userId, voucherId, voucherPoints) => {
  try {
    const userRef = doc(usersRef, userId);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      throw new Error("User not found");
    }
    const currentPoints = userSnap.data().currentPoints || 0;
    if (currentPoints < voucherPoints) {
      throw new Error("Insufficient points");
    }
    await updateDoc(userRef, {
      voucherIds: arrayUnion(voucherId),
      currentPoints: currentPoints - voucherPoints
    });
    const voucherIds = userSnap.data().voucherIds || [];
    if (!voucherIds.includes(voucherId)) {
      await updateDoc(userRef, {
      voucherIds: arrayUnion(voucherId),
      currentPoints: currentPoints - voucherPoints
      });
    }
    return;
  } catch (error) {
    console.error("Error redeeming voucher:", error);
    throw error;
  }
}

const fetchMyVouchers = async (voucherIds) => {
  try {
    const vouchers = [];
    for (const id of voucherIds) {
      const docSnap = await getDoc(doc(vouchersRef, id));
      if (docSnap.exists()) {
        vouchers.push({ 
          id: docSnap.id, 
          image: docSnap.data().image, 
          expiry: extractDate(docSnap.data().expiry) || "N/A",
          text: docSnap.data().text, 
          promoCode: docSnap.data().promoCode, 
        });
      }
    }
    vouchers.sort((a, b) => {
      const expiryA = a.expiry ? new Date(a.expiry.year, a.expiry.month - 1, a.expiry.day).getTime() : 0;
      const expiryB = b.expiry ? new Date(b.expiry.year, b.expiry.month - 1, b.expiry.day).getTime() : 0;
      return expiryB - expiryA;
    });
    return vouchers;
  } catch (error) {
    console.error("Error fetching my vouchers:", error);
    throw error;
  }
};

const convertPointsToCash = async (userId) => {
  try {
    const userRef = doc(usersRef, userId);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      throw new Error("User not found");
    }
    const currentPoints = userSnap.data().currentPoints || 0;
    const wallet = userSnap.data().wallet || 0;
    const cash = currentPoints * 0.1;
    await updateDoc(userRef, {
      currentPoints: 0,
      wallet: wallet + cash
    });
    console.log("Points converted to cash:", cash);
    return { newWallet: wallet + cash };
  } catch (error) {
    console.error("Error converting points to cash:", error);
    throw error;
  }
}

const sendCashToBank = async (userId) => {
  try {
    const userRef = doc(usersRef, userId);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      throw new Error("User not found");
    }
    const wallet = userSnap.data().wallet || 0;
    await updateDoc(userRef, {
      wallet: 0
    });
    console.log("Cash sent to bank:", wallet);
    return { newWallet: 0 };
  } catch (error) {
    console.log(error);
    throw new Error("Error sending to bank");
  }
}

function extractDate(expiry) {
  const milliseconds = expiry.seconds * 1000 + expiry.nanoseconds / 1000000;
  const date = new Date(milliseconds);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return  day + "-" +  month + "-" + year;
}

const scan = async (userId, name, points) => {
  try {
    const q = query(machinesRef, where("name", "==", name));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error("Machine not found");
    }

    const machineSnap = querySnapshot.docs[0];
    const machineRef = doc(machinesRef, machineSnap.id);
    const lastScan = machineSnap.data().lastScan ? machineSnap.data().lastScan.toDate() : null;
    const now = new Date();

    if (!lastScan || (now - lastScan) > 5 * 60 * 1000) {
      await updateDoc(machineRef, { lastScan: now });

      const userRef = doc(usersRef, userId);
      await updateDoc(userRef, {
        totalPoints: increment(points),
        currentPoints: increment(points),
        monthPoints: increment(points)
      });

      return { success: true, message: "Points updated successfully" };
    } else {
      throw new Error("Machine was scanned less than 5 minutes ago");
    }

  } catch(error) {
    console.log(error);
    throw new Error("Error scanning");
  }
}


// FirebaseAPI object with all necessary functions
const FirebaseAPI = {
  createUser,
  createCommunity,
  getMachinesForDisplay,
  fetchVouchers,
  fetchCommunitiesUingIds,
  joinCommunityUsingCode,
  getUserRank,
  getLeaderboard,
  getPublicLeaderboard,
  getUserProfile,
  getMaintenanceLog,
  redeemVoucher,
  fetchMyVouchers,
  convertPointsToCash,
  setBankAccount,
  sendCashToBank,
  scan,
};

export default FirebaseAPI;
