
export const mapInterviewMembersApi = (apiResponse) => {
  const list = Array.isArray(apiResponse?.data)
    ? apiResponse.data
    : Array.isArray(apiResponse)
      ? apiResponse
      : [];

  return list.map(user => ({
    value: user.userId,              // ✅ correct key
    label: `${user.name} - ${user.role}`, // Show both name and role
    email: user.email,
    role: user.role
  }));
};