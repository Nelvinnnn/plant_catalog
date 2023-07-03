import * as firebase from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import * as firestore from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import * as authentication from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";

window.doRegister = doRegister;
window.createUserDocument = createUserDocument;
window.getUserDocument = getUserDocument;
window.doLogin = doLogin;
window.doLogout = doLogout;
window.addCommonName = addCommonName;
//window.checkEnterCommonName = checkEnterCommonName;
window.getAllPlants = getAllPlants;
window.editPlant = editPlant;
window.deletePlant = deletePlant;
window.loadPlant = loadPlant;
window.removeCommonName = removeCommonName;
window.addPicture = addPicture;
window.removePicture = removePicture;
window.toggleFlowerMonth = toggleFlowerMonth;
window.addColor = addColor;
window.removeColor = removeColor;
window.addEdiblePart = addEdiblePart;
window.removeEdiblePart = removeEdiblePart;
window.toggleMedicinal = toggleMedicinal;
window.toggleActive = toggleActive;
window.doCancel = doCancel;
window.saveChanges = saveChanges;
window.getAllUsers = getAllUsers;
window.toggleReadAccess = toggleReadAccess;
window.toggleWriteAccess = toggleWriteAccess;

const firebaseConfig = {
  apiKey: "AIzaSyCLoo6ESLPzN4i203pGYNit9qtHb24onjs",
  authDomain: "assignment4-c84e2.firebaseapp.com",
  projectId: "assignment4-c84e2",
  storageBucket: "assignment4-c84e2.appspot.com",
  messagingSenderId: "869694318578",
  appId: "1:869694318578:web:edaad0b7372fbd89546d6b",
  measurementId: "G-Y3HEY7BYCV"
};

const app = firebase.initializeApp(firebaseConfig);
const auth = authentication.getAuth(app);
const db = firestore.getFirestore(app);


var loggedInUserDocument = null;

  authentication.onAuthStateChanged(auth, function(user) {
    
    if (user) {

      //the user is signed in
      if (loggedInUserDocument === null) {
        getUserDocument(user.uid);
      }
        
      
    } else {
      console.log(log);
      window.location = "login.html";
      

        
    }
  });

  
  function doRegister() {
  
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("password-confirm").value;

  if (password == confirmPassword) {
    authentication.createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const uid = user.uid;
        const photoURL = "https://upload.wikimedia.org/wikipedia/commons/8/83/James_McGill.jpg";

        createUserDocument(uid, name, photoURL);
        window.location = "dmplants.html";
      })
      .catch((error) => {
        console.log(error.code, error.message);
      });
  } else {
    alert("Your passwords do not match.");
  }
   
};


  function doLogin() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
  
    authentication.signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        window.location = "dmplants.html";
      })
      .catch((error) => {
        console.log(error.code, error.message);
      });

  }

  function doLogout() {

    authentication.signOut(auth).then(() => {
      window.location = 'login.html';
    });
    
  }

  function createUserDocument(uid, username, photoURL) {
    const newUserDoc = firestore.doc(db, "users", uid);
    firestore.setDoc(newUserDoc, {
      uid: uid,
      name: username,
      canRead: true,
      canWrite: false,
      photo: photoURL,
    }).then(() => {
      getUserDocument(uid);
    });
  }
  

  function getUserDocument(uid) {
    /*
    //get the document for the user
    //if the user is on the dmplants.html or dmusers.html page, show their name and photo in the user widget
    //give the user photo class="userAvatar"
    
      if (window.location.pathname == "/dmplants.html" || (window.location.pathname == "/dmusers.html")) {
          //display the user photo on the page
          //display the user's name on the page
      }

      */
    const userDocRef = firestore.doc(db, "users", uid);

  firestore.getDoc(userDocRef).then((docSnapshot) => {
    if (docSnapshot.exists()) {
      const userData = docSnapshot.data();
      console.log("User data:", userData); // Debugging log

      if (window.location.pathname === "/dmplants.html" || window.location.pathname === "/dmusers.html") {
        // Set the user avatar image source
        const userAvatar = document.getElementById("userAvatar");
        if (userAvatar) {
          userAvatar.src = userData.photo;
        }
        console.log("User avatar:", userAvatar); // Debugging log

        // Set the user name
        const userName = document.getElementById("loggedInUserName");
        if (userName) {
          userName.innerText = userData.name;
        }
        console.log("User name:", userName); // Debugging log
      }
    } else {
      console.error("User document not found");
    }
  });
  }

  
  function getAllPlants() {
    console.log("getAllPlants function called");
    
    const plantList = document.getElementById('plantList');
    const db = firebase.firestore();
    
    db.collection('plants').get().then((querySnapshot) => {

      console.log("Data fetched:", querySnapshot);
      let plantCount = 0;
      querySnapshot.forEach((doc) => {
        const plantData = doc.data();
        console.log("Plant data:", plantData);
        const plantID = doc.id;
        const plantRow = document.createElement('div');
        plantRow.classList.add('tableRow');
  
        const scientificNameColumn = document.createElement('div');
        scientificNameColumn.classList.add('scientificNameColumn');
        scientificNameColumn.innerText = plantData.scientificName;
        scientificNameColumn.addEventListener('click', () => loadPlant(plantID));
        plantRow.appendChild(scientificNameColumn);
  
        const commonNamesColumn = document.createElement('div');
        commonNamesColumn.classList.add('commonNamesColumn');
        commonNamesColumn.innerText = plantData.commonNames.join(', ');
        plantRow.appendChild(commonNamesColumn);
  
        const activeColumn = document.createElement('div');
        activeColumn.classList.add('activeColumn');
        activeColumn.innerText = plantData.active ? 'Published' : 'Unpublished';
        plantRow.appendChild(activeColumn);
  
        const actionsColumn = document.createElement('div');
        actionsColumn.classList.add('actionsColumn');
        const deleteIcon = document.createElement('i');
        deleteIcon.classList.add('material-symbols-rounded', 'icon-trash');
        deleteIcon.addEventListener('click', () => deletePlant(plantID));
        actionsColumn.appendChild(deleteIcon);
        plantRow.appendChild(actionsColumn);
  
        plantList.appendChild(plantRow);
        plantCount++;
      });
      document.getElementById('additionalInfo').innerText = plantCount + ' plant records';
    });


    
  }
 
 

  function getAllUsers() {
   
  }

  function renderUserList(currentUser) {
    //refer to dmusers.html for a template of how each row should look and the data that should be displayed
    //if a user has canRead = true, the current user should be able to click on "Cannot View Data" to set the property as false
    //this selection should be saved to firestore immediately and the user list should update to show the new selections.
    //a partially completed user list is provided below

    var htmlBuilder= "<div class='tableRow'>";
    htmlBuilder+= "<div class='usernameTableColumn'></div>";
    htmlBuilder+= "<div class='userCanReadTableColumn'>";
    htmlBuilder+= "<div class='accessToggle'>Cannot View Data</div>";
    htmlBuilder+= "<div class='accessToggleSelected'>Can View Data</div>";
    htmlBuilder+= "</div>"; //closes userCanReadTableColumn
    htmlBuilder+= "</div>"; //closes tableRow
    document.getElementById("userList").innerHTML += htmlBuilder;
  }

  function renderPlantList(currentPlant) {
    //an example is provided below
    var htmlBuilder = "<div class='tableRow'>";
    htmlBuilder+="<div class='scientificNameColumn'></div>";
    htmlBuilder+="<div class='commonNamesColumn'>";
    htmlBuilder+="</div>";
    htmlBuilder+="<div class='activeColumn'>";
    htmlBuilder+="</div>";
    htmlBuilder+="<div class='actionsColumn'>";
    htmlBuilder+="<div class='tableIconContainer'>";
    htmlBuilder+="<i class='material-symbols-rounded'>delete</i>";
    htmlBuilder+="</div>";
    htmlBuilder+="</div>";
    htmlBuilder+="</div>";
    document.getElementById("plantList").innerHTML += htmlBuilder;
  }

  function editPlant(plantID) {
    document.getElementById("productSubheading").innerHTML = "Create or edit a plant";
    document.getElementById("additionalInfo").innerHTML = "Add a new plant to the catalog or edit an existing record";
  }

  function loadPlant() {
    
  }

  function deletePlant() {
    const plantRef = firestore.doc(db, "plants", plantID);
  firestore.deleteDoc(plantRef).then(() => {
    // Remove the plant row from the UI
    const plantRow = document.getElementById(`plantRow-${plantID}`);
    plantRow.remove();
  }).catch((error) => {
    console.error("Error deleting plant:", error);
  });

  }

  function buildCommonNames() {
    //a sample is provided below
    var chipBuilder = "";
    chipBuilder+= "<div class='commonNameChip'>";
    chipBuilder+= "Some common name"
    chipBuilder+= "<div class='commonNameChipButton'>";
    chipBuilder+= "<i class='material-symbols-rounded' style='font-size: 15px'>close</i>";
    chipBuilder+= "</div>";
    chipBuilder+= "</div>";
    document.getElementById("commonNameChipContainer").innerHTML = chipBuilder;
  }

  function addCommonName() {
    
  }

  function removeCommonName(x) {
    
  }

  function addPicture() {
   
  }

  function removePicture(x) {
    
  }

  function buildPictures() {
    //a sample is provided below
    var pictureBuilder = "";
    pictureBuilder+= "<div class='newPlantImageContainer'>";
    pictureBuilder+= "<img src='some plant picture url' class='newPlantImage' />";
    pictureBuilder+= "<div class='newPlantImageRemoveButton'>";
    pictureBuilder+= "<i class='material-symbols-rounded' style='font-size: 15px'>close</i>";
    pictureBuilder+= "</div>";
    pictureBuilder+= "</div>";
    document.getElementById("plantPicturesContainer").innerHTML = pictureBuilder;
  }

  function toggleFlowerMonth(x) {
    
  }

  function buildFloweringMonths() {
    //a sample is provided below
    var monthsBuilder = "";
    monthsBuilder+= "<div class='toggleOption toggleOptionSelected' style='cursor: pointer'>";
    // OR (depending on whether the plant flowers in this month or not)
    monthsBuilder+= "<div class='toggleOption'>";
    
    // ALWAYS (this part can stay the same regardless of whether the plant flowers or not)
    monthsBuilder+= "JAN"
    monthsBuilder+= "</div>";
    document.getElementById("floweringMonthsContainer").innerHTML = monthsBuilder;
  }

  function addColor() {
    
  }

  function removeColor(x) {
    
  }

  function buildColors() {
    //a sample is provided below
    var colorBuilder = "";
    colorBuilder+="<div class='commonNameChip'>";
    colorBuilder+="Red"
    colorBuilder+="<div class='commonNameChipButton'";
    colorBuilder+="<i class='material-symbols-rounded' style='font-size: 15px'>close</i>";
    colorBuilder+="</div>";
    colorBuilder+="</div>";
    document.getElementById("colorsChipContainer").innerHTML = colorBuilder;
  }

  function addEdiblePart() {
    
  }

  function removeEdiblePart(x) {
   
  }

  function buildEdibleParts() {
    //a sample is provided below
    var edibleBuilder = "";
    edibleBuilder+= "<div class='commonNameChip'>";
    edibleBuilder+= "roots";
    edibleBuilder+= "<div class='commonNameChipButton'>";
    edibleBuilder+= "<i class='material-symbols-rounded' style='font-size: 15px'>close</i>";
    edibleBuilder+= "</div>";
    edibleBuilder+= "</div>";
    document.getElementById("ediblePartsChipContainer").innerHTML = edibleBuilder;
  }

  function buildMedicinal() {
    //a sample is provided below
    var medicinalBuilder = "";
    //option not selected:
    medicinalBuilder+= "<div class='toggleOption'>No</div>";

    //OR option selected:
    medicinalBuilder+= "<div class='toggleOption toggleOptionSelected'>Yes</div>";
    document.getElementById("medicinalOptions").innerHTML = medicinalBuilder;
  }

  function toggleMedicinal(medicinal) {
    
  }

  function buildActive() {
    //a sample is provided below:
    var activeBuilder = "";
    
    //option not selected
    activeBuilder+= "<div class='toggleOption'>No</div>";

    //OR option selected
    activeBuilder+= "<div class='toggleOption toggleOptionSelected'>Yes</div>";
    document.getElementById("publishOptions").innerHTML = activeBuilder;
  }

  function doCancel() {
    
  }

  function saveChanges() {
    
  }

  function toggleReadAccess(uid, flag) {
    
  };

  function toggleWriteAccess(uid, flag) {
   
  }

  function toggleActive(a) {
   
  }
