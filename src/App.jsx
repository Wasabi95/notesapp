// import { useState, useEffect } from "react";
// import {
//   Authenticator,
//   Button,
//   Text,
//   TextField,
//   Heading,
//   Flex,
//   View,
//   Image,
//   Grid,
//   Divider,
// } from "@aws-amplify/ui-react";
// import { Amplify } from "aws-amplify";
// import "@aws-amplify/ui-react/styles.css";
// import { getUrl } from "aws-amplify/storage";
// import { uploadData } from "aws-amplify/storage";
// import { generateClient } from "aws-amplify/data";
// import outputs from "../amplify_outputs.json";
// /**
//  * @type {import('aws-amplify/data').Client<import('../amplify/data/resource').Schema>}
//  */

// Amplify.configure(outputs);
// const client = generateClient({
//   authMode: "userPool",
// });

// export default function App() {
//   const [notes, setNotes] = useState([]);

//   useEffect(() => {
//     fetchNotes();
//   }, []);

//   async function fetchNotes() {
//     const { data: notes } = await client.models.Note.list();
//     await Promise.all(
//       notes.map(async (note) => {
//         if (note.image) {
//           const linkToStorageFile = await getUrl({
//             path: ({ identityId }) => `media/${identityId}/${note.image}`,
//           });
//           console.log(linkToStorageFile.url);
//           note.image = linkToStorageFile.url;
//         }
//         return note;
//       })
//     );
//     console.log(notes);
//     setNotes(notes);
//   }

//   async function createNote(event) {
//     event.preventDefault();
//     const form = new FormData(event.target);
//     console.log(form.get("image").name);

//     const { data: newNote } = await client.models.Note.create({
//       name: form.get("name"),
//       description: form.get("description"),
//       image: form.get("image").name,
//     });

//     console.log(newNote);
//     if (newNote.image)
//       if (newNote.image)
//         await uploadData({
//           path: ({ identityId }) => `media/${identityId}/${newNote.image}`,

//           data: form.get("image"),
//         }).result;

//     fetchNotes();
//     event.target.reset();
//   }

//   async function deleteNote({ id }) {
//     const toBeDeletedNote = {
//       id: id,
//     };

//     const { data: deletedNote } = await client.models.Note.delete(
//       toBeDeletedNote
//     );
//     console.log(deletedNote);

//     fetchNotes();
//   }

//   return (
//     <Authenticator>
//       {({ signOut }) => (
//         <Flex
//           className="App"
//           justifyContent="center"
//           alignItems="center"
//           direction="column"
//           width="70%"
//           margin="0 auto"
//         >
//           <Heading level={1}>My Notes App</Heading>
//           <View as="form" margin="3rem 0" onSubmit={createNote}>
//             <Flex
//               direction="column"
//               justifyContent="center"
//               gap="2rem"
//               padding="2rem"
//             >
//               <TextField
//                 name="name"
//                 placeholder="Note Name"
//                 label="Note Name"
//                 labelHidden
//                 variation="quiet"
//                 required
//               />
//               <TextField
//                 name="description"
//                 placeholder="Note Description"
//                 label="Note Description"
//                 labelHidden
//                 variation="quiet"
//                 required
//               />
//               <View
//                 name="image"
//                 as="input"
//                 type="file"
//                 alignSelf={"end"}
//                 accept="image/png, image/jpeg"
//               />

//               <Button type="submit" variation="primary">
//                 Create Note
//               </Button>
//             </Flex>
//           </View>
//           <Divider />
//           <Heading level={2}>Current Notes</Heading>
//           <Grid
//             margin="3rem 0"
//             autoFlow="column"
//             justifyContent="center"
//             gap="2rem"
//             alignContent="center"
//           >
//             {notes.map((note) => (
//               <Flex
//                 key={note.id || note.name}
//                 direction="column"
//                 justifyContent="center"
//                 alignItems="center"
//                 gap="2rem"
//                 border="1px solid #ccc"
//                 padding="2rem"
//                 borderRadius="5%"
//                 className="box"
//               >
//                 <View>
//                   <Heading level="3">{note.name}</Heading>
//                 </View>
//                 <Text fontStyle="italic">{note.description}</Text>
//                 {note.image && (
//                   <Image
//                     src={note.image}
//                     alt={`visual aid for ${notes.name}`}
//                     style={{ width: 400 }}
//                   />
//                 )}
//                 <Button
//                   variation="destructive"
//                   onClick={() => deleteNote(note)}
//                 >
//                   Delete note
//                 </Button>
//               </Flex>
//             ))}
//           </Grid>
//           <Button onClick={signOut}>Sign Out</Button>
//         </Flex>
//       )}
//     </Authenticator>
//   );
// }


import { useState, useEffect } from "react";
import {
  Authenticator,
  Button,
  Text,
  TextField,
  Heading,
  Flex,
  View,
  Image,
  Grid,
  Divider,
} from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import { getUrl } from "aws-amplify/storage";
import { uploadData } from "aws-amplify/storage";
import { generateClient } from "aws-amplify/data";
import outputs from "../amplify_outputs.json";

Amplify.configure(outputs);
const client = generateClient({
  authMode: "userPool",
});

export default function App() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    const { data: notes } = await client.models.Note.list();
    await Promise.all(
      notes.map(async (note) => {
        if (note.image) {
          const linkToStorageFile = await getUrl({
            path: ({ identityId }) => `media/${identityId}/${note.image}`,
          });
          note.image = linkToStorageFile.url;
        }
        return note;
      })
    );
    setNotes(notes);
  }

  async function createNote(event) {
    event.preventDefault();
    const form = new FormData(event.target);

    const { data: newNote } = await client.models.Note.create({
      name: form.get("name"),
      description: form.get("description"),
      image: form.get("image").name,
    });

    if (newNote.image) {
      await uploadData({
        path: ({ identityId }) => `media/${identityId}/${newNote.image}`,
        data: form.get("image"),
      }).result;
    }

    fetchNotes();
    event.target.reset();
  }

  async function deleteNote({ id }) {
    await client.models.Note.delete({ id });
    fetchNotes();
  }

  return (
    <Authenticator
      components={{
        SignUp: ({ fields, ...props }) => (
          <Authenticator.SignUp
            {...props}
            fields={[
              {
                name: "email",
                type: "email",
                label: "Email Address",
                required: true,
              },
              {
                name: "preferred_username",
                type: "text",
                label: "Display Name",
                required: true,
              },
              ...fields,
            ]}
          />
        ),
      }}
    >
      {({ signOut, user }) => {
        const displayName =
          user?.attributes?.preferred_username ||
          user?.attributes?.email ||
          "Guest";

        return (
          <Flex className="App">
            {/* Navbar */}
            <View className="navbar">
              <Heading level={3}>My Notes App</Heading>
              <Flex gap="1rem" alignItems="center">
                <Text fontWeight="600">{displayName}</Text>
                <Button variation="link" onClick={signOut}>
                  Sign Out
                </Button>
              </Flex>
            </View>

            {/* Main Content */}
            <View className="main-content">
              <Heading level={1} marginTop="2rem">
                My Notes App
              </Heading>

              {/* Create Note Form */}
              <View as="form" margin="3rem 0" onSubmit={createNote}>
                <Flex
                  direction="column"
                  justifyContent="center"
                  gap="2rem"
                  padding="2rem"
                  className="form-container"
                >
                  <TextField
                    name="name"
                    placeholder="Note Name"
                    label="Note Name"
                    labelHidden
                    variation="quiet"
                    required
                  />
                  <TextField
                    name="description"
                    placeholder="Note Description"
                    label="Note Description"
                    labelHidden
                    variation="quiet"
                    required
                  />
                  <View
                    name="image"
                    as="input"
                    type="file"
                    alignSelf="end"
                    accept="image/png, image/jpeg"
                  />
                  <Button type="submit" variation="primary">
                    Create Note
                  </Button>
                </Flex>
              </View>

              <Divider />

              {/* Notes Grid */}
              <Heading level={2}>Current Notes</Heading>
              <Grid className="notes-grid" margin="3rem 0">
                {notes.map((note) => (
                  <Flex
                    key={note.id || note.name}
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    gap="2rem"
                    padding="2rem"
                    className="note-card"
                  >
                    <Heading level={3}>{note.name}</Heading>
                    <Text fontStyle="italic">{note.description}</Text>
                    {note.image && (
                      <Image
                        src={note.image}
                        alt={`visual aid for ${note.name}`}
                        className="upload-preview"
                      />
                    )}
                    <Button
                      variation="destructive"
                      onClick={() => deleteNote(note)}
                    >
                      Delete note
                    </Button>
                  </Flex>
                ))}
              </Grid>
            </View>
          </Flex>
        );
      }}
    </Authenticator>
  );
}