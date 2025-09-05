export const subUserModel = `
    id
    firstName
    lastName
    email
    emailVerified
    phoneNumber
    phoneVerified
    avatar
    birthday
    status
    role
    gender
    createdAt
    updatedAt
`;

export const userModel = `
    id
    firstName
    lastName
    email
    emailVerified
    phoneNumber
    phoneVerified
    avatar
    birthday
    status
    role
    gender
    createdUser {
      ${subUserModel}
    }
    updatedUser {
        ${subUserModel}
    }
    createdAt
    updatedAt
`;
