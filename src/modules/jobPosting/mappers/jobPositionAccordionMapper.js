export const mapJobPositionFromApi = (api = {}) => {
  return {
    // common id field
    positionId: api.id ?? api.positionId ?? null,

    // name/title
    positionName: api.positionName ?? api.name ?? api.title ?? "",

    // counts
    vacancies: api.vacancies ?? api.vacancyCount ?? api.noOfVacancies ?? 0,

    // age
    minAge: api.minAge ?? api.minimumAge ?? null,
    maxAge: api.maxAge ?? api.maximumAge ?? null,

    // education / description
    mandatoryEducation: api.mandatoryEducation ?? api.mandatory_education ?? "",
    preferredEducation: api.preferredEducation ?? api.preferred_education ?? "",

    // keep raw response for any extra fields
    raw: api
  };
};

export default mapJobPositionFromApi;