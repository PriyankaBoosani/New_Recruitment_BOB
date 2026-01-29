// export const mapInterviewMembersApi = (apiResponse) => {
//   const list = Array.isArray(apiResponse?.data)
//     ? apiResponse.data
//     : [];

//   return list.map(item => ({
//     value: item.userDTO.userId,   // REQUIRED by react-select
//     label: item.userDTO.name,     // REQUIRED by react-select
//     email: item.userDTO.email,
//     role: item.userDTO.role,
//     isDisabled: item.assigned     // disables already assigned members
//   }));
// };

export const mapInterviewMembersApi = (apiResponse) => {
  const list = Array.isArray(apiResponse?.data)
    ? apiResponse.data
    : Array.isArray(apiResponse)
    ? apiResponse
    : [];

  return list.map(user => ({
    value: user.userid,              // ✅ correct key
    label: user.name, // nicer display
    email: user.email,
    role: user.role
  }));
};