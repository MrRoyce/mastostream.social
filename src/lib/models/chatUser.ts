export interface ChatUser {
  type: string;
  uid: string;
  userName: string;
}

export function validateChatUser(user: any): ChatUser | undefined {

  if (typeof user !== "object") {
    return;
  }

  let userName
  let type
  let uid

  Object.keys(user).forEach(function (prop) {
    // `prop` is the property name
    // `data[prop]` is the property value

    ({ type, userName, uid } = user[prop])

    // Object.keys(user[prop]).forEach(function (attr) {


    //   if (attr === 'userName') {
    //     userName = prop[attr]
    //   } else if (attr === 'type') {
    //     type = prop[attr]
    //   } else if (attr === 'uid') {
    //     uid = prop[attr]
    //   }
    //})

  });

  console.log('userName', userName)
  console.log('type', type)
  console.log('uid', uid)


  // if (
  //   typeof type !== "string" ||
  //   typeof uid !== "number" ||
  //   typeof userName !== "string"
  // ) {
  //   return;
  // }

  return {
    type,
    uid,
    userName
  };
}