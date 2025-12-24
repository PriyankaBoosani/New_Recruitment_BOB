
export const mapInterviewMembersApi = (apiResponse) => {
  const list = Array.isArray(apiResponse?.data)
    ? apiResponse.data
    : [];

  return list
    .filter(item => item?.userDTO?.isActive)
    .map(item => ({
      id: item.userDTO.userId,
      name: item.userDTO.name,
      email: item.userDTO.email,
      role: item.userDTO.role,
      assigned: item.assigned
    }));
};
