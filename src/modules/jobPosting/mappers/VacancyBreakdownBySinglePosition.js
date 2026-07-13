export const mapVacancyBreakdownByPosition = (
  response,
  masterData = {}
) => {
  const data = response?.data || response || {};

  const reservationMap = {};
  const disabilityMap = {};

  const exServiceMap = {};

  (masterData?.exServiceCategories || []).forEach((item) => {
    exServiceMap[item.groupId] = item.exsCategoryCode;
  });


  console.log("Master Ex Service Categories", masterData.exServiceCategories);

  console.log("Ex Service Map", exServiceMap);

  (masterData?.reservationCategories || []).forEach((item) => {
    reservationMap[item.id] = item.code;
  });

  (masterData?.disabilityCategories || []).forEach((item) => {
    disabilityMap[item.id] =
      item.disabilityCode || item.code;
  });



  const getDepartmentName = (id) =>
    masterData?.departments?.find(
      (d) => String(d.id || d.departmentId) === String(id)
    )?.name ||
    masterData?.departments?.find(
      (d) => String(d.departmentId) === String(id)
    )?.departmentName ||
    "-";

  const getPositionName = (id) =>
    masterData?.masterPositions?.find(
      (p) => String(p.id) === String(id)
    )?.name || "-";

  const getEmploymentType = (id) =>
    masterData?.employmentTypes?.find(
      (e) => String(e.id) === String(id)
    )?.name || "-";

  const getStateName = (id) =>
    masterData?.states?.find(
      (s) => String(s.stateId) === String(id)
    )?.stateName || "-";

  const getCityName = (id) =>
    masterData?.cities?.find(
      (c) => String(c.cityId) === String(id)
    )?.cityName || "-";

  const getReservationCode = (id) =>
    masterData?.reservationCategories?.find(
      (c) =>
        String(c.id || c.reservationCategoriesId) === String(id)
    )?.code || "";

  const getDisabilityCode = (id) =>
    masterData?.disabilityCategories?.find(
      (d) =>
        String(d.id || d.disabilityCategoryId) === String(id)
    )?.code || "";


  return {
    positionId: data.positionId,
    masterPositionId: data.masterPositionId,
    positionName: getPositionName(data.masterPositionId),

    departmentId: data.deptId,
    departmentName: getDepartmentName(data.deptId),

    employmentTypeId: data.employmentType,
    employmentType: getEmploymentType(data.employmentType),

    contractYears: data.contractYears || 0,
    eligibilityAge: `${data.eligibilityAgeMin}-${data.eligibilityAgeMax}`,

    vacancies: data.totalVacancies,
    onboardedCount: data.onboardedCount,
    mandatoryExperienceMonths: data.mandatoryExperienceMonths,
    offersSent: data.offersSent,
    offersAccepted: data.offersAccepted,
    reservationType: data.isLocationWise
      ? "STATE_WISE"
      : "NATIONAL",

    nationalReservation: (() => {
      const row = {
        sc: 0,
        st: 0,
        obc: 0,
        ews: 0,
        gen: 0,

        hi: 0,
        oc: 0,
        vi: 0,
        idd: 0,

        exs: 0,
        dxs: 0,

        total: data.totalVacancies || 0,
      };



      (data.nationalBreakdown || []).forEach((cat) => {

        // console.log("National Category Debug", {
        //     reservationCategoryId: cat.reservationCategoryId,
        //     reservationCode:
        //         reservationMap[cat.reservationCategoryId],
        //     vacancyCount: cat.vacancyCount,
        //     isDisability: cat.isDisability,
        // });
        if (!cat.isDisability) {

          // Temporary mapping for EXS & DXS until backend provides IDs
          if (cat.isExServiceman) {
            const code = exServiceMap[cat.exServicemanGroupId];

            console.log("EX SERVICE DEBUG", {
              groupId: cat.exServicemanGroupId,
              code,
              vacancy: cat.vacancyCount,
              map: exServiceMap
            });

            switch (code) {
              case "EXS":
                row.exs = cat.vacancyCount || 0;
                break;

              case "DXS":
              case "DDXS":
                row.dxs += cat.vacancyCount || 0;
                break;
            }

            return;
          }

          const code = reservationMap[cat.reservationCategoryId];

          switch (code) {
            case "SC":
              row.sc = cat.vacancyCount || 0;
              break;

            case "ST":
              row.st = cat.vacancyCount || 0;
              break;

            case "OBC":
              row.obc = cat.vacancyCount || 0;
              break;

            case "EWS":
              row.ews = cat.vacancyCount || 0;
              break;

            case "GEN":
              row.gen = cat.vacancyCount || 0;
              break;

            default:
              break;
          }
        } else {
          const code =
            disabilityMap[cat.disabilityCategoryId];

          switch (code) {
            case "HI":
              row.hi = cat.vacancyCount || 0;
              break;
            case "OC":
              row.oc = cat.vacancyCount || 0;
              break;
            case "VI":
              row.vi = cat.vacancyCount || 0;
              break;
            case "ID":
              row.idd = cat.vacancyCount || 0;
              break;
            default:
              break;
          }
        }
      });





      const emp = masterData?.employmentTypes?.find(
        (item) =>
          String(item.id).trim() ===
          String(data.employmentType).trim()
      );


      return row;
    })(),

    nationalOnboarded: (() => {
      const row = {
        sc: 0,
        st: 0,
        obc: 0,
        ews: 0,
        gen: 0,

        hi: 0,
        oc: 0,
        vi: 0,
        idd: 0,

        exs: 0,
        dxs: 0,

        total: data.onboardedCount || 0,
      };



      (data.nationalBreakdown || []).forEach((cat) => {
        if (!cat.isDisability) {

          // Temporary mapping for EXS & DXS until backend provides IDs
          if (cat.isExServiceman) {
            const code = exServiceMap[cat.exServicemanGroupId];

            switch (code) {
              case "EXS":
                row.exs = cat.onboardedCount || 0;
                break;

              case "DXS":
              case "DDXS":
                row.dxs += cat.onboardedCount || 0;
                break;

              default:
                break;
            }

            return;
          }

          const code = reservationMap[cat.reservationCategoryId];

          switch (code) {
            case "SC":
              row.sc = cat.onboardedCount || 0;
              break;

            case "ST":
              row.st = cat.onboardedCount || 0;
              break;

            case "OBC":
              row.obc = cat.onboardedCount || 0;
              break;

            case "EWS":
              row.ews = cat.onboardedCount || 0;
              break;

            case "GEN":
              row.gen = cat.onboardedCount || 0;
              break;

            default:
              break;
          }
        } else {
          const code =
            disabilityMap[cat.disabilityCategoryId];

          switch (code) {
            case "HI":
              row.hi = cat.onboardedCount || 0;
              break;
            case "OC":
              row.oc = cat.onboardedCount || 0;
              break;
            case "VI":
              row.vi = cat.onboardedCount || 0;
              break;
            case "ID":
              row.idd = cat.onboardedCount || 0;
              break;
            default:
              break;
          }
        }
      });

      return row;
    })(),

    stateWiseReservation:
      (data.stateBreakdown || []).map((state) => {

        const stateMaster = masterData?.states?.find(
          (s) => String(s.stateId).trim() === String(state.stateId).trim()
        );

        const cityMaster = masterData?.cities?.find(
          (c) => String(c.cityId).trim() === String(state.cityId).trim()
        );

        const row = {
          stateId: state.stateId,
          cityId: state.cityId,

          state: stateMaster?.stateName || "-",
          city: cityMaster?.cityName || "-",

          sc: 0,
          st: 0,
          obc: 0,
          ews: 0,
          gen: 0,

          hi: 0,
          oc: 0,
          vi: 0,
          idd: 0,

          exs: 0,
          dxs: 0,

          total: state.totalVacancies || 0,
        };


        (state.categories || []).forEach((cat) => {

          if (!cat.isDisability) {

            // Temporary mapping until backend sends EXS/DXS ids
            if (cat.isExServiceman) {
              const code = exServiceMap[cat.exServicemanGroupId];

              switch (code) {
                case "EXS":
                  row.exs = cat.vacancyCount || 0;
                  break;

                case "DXS":
                case "DDXS":
                  row.dxs += cat.vacancyCount || 0;
                  break;

                default:
                  break;
              }

              return;
            }

            const code = reservationMap[cat.reservationCategoryId];

            switch (code) {
              case "SC":
                row.sc = cat.vacancyCount || 0;
                break;
              case "ST":
                row.st = cat.vacancyCount || 0;
                break;
              case "OBC":
                row.obc = cat.vacancyCount || 0;
                break;
              case "EWS":
                row.ews = cat.vacancyCount || 0;
                break;
              case "GEN":
                row.gen = cat.vacancyCount || 0;
                break;
              default:
                break;
            }

          } else {

            const code = disabilityMap[cat.disabilityCategoryId];

            switch (code) {
              case "HI":
                row.hi = cat.vacancyCount || 0;
                break;
              case "OC":
                row.oc = cat.vacancyCount || 0;
                break;
              case "VI":
                row.vi = cat.vacancyCount || 0;
                break;
              case "ID":
                row.idd = cat.vacancyCount || 0;
                break;
              default:
                break;
            }
          }
        });

        return row;
      }) || [],

    stateWiseOnboarded:
      (data.stateBreakdown || []).map((state) => {

        const stateMaster = masterData?.states?.find(
          (s) =>
            String(s.stateId).trim() ===
            String(state.stateId).trim()
        );

        const cityMaster = masterData?.cities?.find(
          (c) =>
            String(c.cityId).trim() ===
            String(state.cityId).trim()
        );

        const row = {
          stateId: state.stateId,
          cityId: state.cityId,

          state: stateMaster?.stateName || "-",
          city: cityMaster?.cityName || "-",

          sc: 0,
          st: 0,
          obc: 0,
          ews: 0,
          gen: 0,

          hi: 0,
          oc: 0,
          vi: 0,
          idd: 0,

          exs: 0,
          dxs: 0,

          total: state.onboardedCount || 0,
        };



        (state.categories || []).forEach((cat) => {
          if (!cat.isDisability) {

            // Temporary mapping until backend sends EXS/DXS ids
            if (cat.isExServiceman) {
              const code = exServiceMap[cat.exServicemanGroupId];

              switch (code) {
                case "EXS":
                  row.exs = cat.onboardedCount || 0;
                  break;

                case "DXS":
                case "DDXS":
                  row.dxs += cat.onboardedCount || 0;
                  break;

                default:
                  break;
              }

              return;
            }

            const code = reservationMap[cat.reservationCategoryId];

            switch (code) {
              case "SC":
                row.sc = cat.onboardedCount || 0;
                break;

              case "ST":
                row.st = cat.onboardedCount || 0;
                break;

              case "OBC":
                row.obc = cat.onboardedCount || 0;
                break;

              case "EWS":
                row.ews = cat.onboardedCount || 0;
                break;

              case "GEN":
                row.gen = cat.onboardedCount || 0;
                break;

              default:
                break;
            }

          } else {

            const code = disabilityMap[cat.disabilityCategoryId];

            switch (code) {
              case "HI":
                row.hi = cat.onboardedCount || 0;
                break;

              case "OC":
                row.oc = cat.onboardedCount || 0;
                break;

              case "VI":
                row.vi = cat.onboardedCount || 0;
                break;

              case "ID":
                row.idd = cat.onboardedCount || 0;
                break;

              default:
                break;
            }
          }
        });

        return row;
      }),


    stateWiseOffersSent:
      (data.stateBreakdown || []).map((state) => {
        const stateMaster = masterData?.states?.find(
          (s) =>
            String(s.stateId).trim() ===
            String(state.stateId).trim()
        );

        const cityMaster = masterData?.cities?.find(
          (c) =>
            String(c.cityId).trim() ===
            String(state.cityId).trim()
        );

        const row = {
          stateId: state.stateId,
          cityId: state.cityId,

          state: stateMaster?.stateName || "-",
          city: cityMaster?.cityName || "-",

          sc: 0,
          st: 0,
          obc: 0,
          ews: 0,
          gen: 0,

          hi: 0,
          oc: 0,
          vi: 0,
          idd: 0,

          exs: 0,
          dxs: 0,

          total: state.offersSent || 0,
        };


        (state.categories || []).forEach((cat) => {
          if (!cat.isDisability) {

            // Temporary mapping until backend sends EXS/DXS ids
            const value = cat.offersSent || 0;

            if (cat.isExServiceman) {
              const code = exServiceMap[cat.exServicemanGroupId];

              switch (code) {
                case "EXS":
                  row.exs = value;
                  break;

                case "DXS":
                case "DDXS":
                  row.dxs += value;
                  break;

                default:
                  break;
              }

              return;
            }

            const code = reservationMap[cat.reservationCategoryId];

            switch (code) {
              case "SC":
                row.sc = cat.offersSent || 0;
                break;

              case "ST":
                row.st = cat.offersSent || 0;
                break;

              case "OBC":
                row.obc = cat.offersSent || 0;
                break;

              case "EWS":
                row.ews = cat.offersSent || 0;
                break;

              case "GEN":
                row.gen = cat.offersSent || 0;
                break;

              default:
                break;
            }

          } else {

            const code = disabilityMap[cat.disabilityCategoryId];

            switch (code) {
              case "HI":
                row.hi = cat.offersSent || 0;
                break;

              case "OC":
                row.oc = cat.offersSent || 0;
                break;

              case "VI":
                row.vi = cat.offersSent || 0;
                break;

              case "ID":
                row.idd = cat.offersSent || 0;
                break;

              default:
                break;
            }
          }
        });

        return row;
      }),
    nationalOffersSent: (() => {
      const row = {
        sc: 0,
        st: 0,
        obc: 0,
        ews: 0,
        gen: 0,

        hi: 0,
        oc: 0,
        vi: 0,
        idd: 0,

        exs: 0,
        dxs: 0,

        total: data.offersSent || 0,
      };


      (data.nationalBreakdown || []).forEach((cat) => {

        if (!cat.isDisability) {

          const value = cat.offersSent || 0;

          if (cat.isExServiceman) {
            const code = exServiceMap[cat.exServicemanGroupId];

            switch (code) {
              case "EXS":
                row.exs = value;
                break;

              case "DXS":
              case "DDXS":
                row.dxs += value;
                break;

              default:
                break;
            }

            return;
          }

          const code = reservationMap[cat.reservationCategoryId];

          switch (code) {
            case "SC":
              row.sc = value;
              break;
            case "ST":
              row.st = value;
              break;
            case "OBC":
              row.obc = value;
              break;
            case "EWS":
              row.ews = value;
              break;
            case "GEN":
              row.gen = value;
              break;
            default:
              break;
          }

        } else {

          const code = disabilityMap[cat.disabilityCategoryId];

          switch (code) {
            case "HI":
              row.hi = cat.offersSent || 0;
              break;
            case "OC":
              row.oc = cat.offersSent || 0;
              break;
            case "VI":
              row.vi = cat.offersSent || 0;
              break;
            case "ID":
              row.idd = cat.offersSent || 0;
              break;
            default:
              break;
          }
        }

        const code = reservationMap[cat.reservationCategoryId];

        switch (code) {
          case "SC":
            row.sc = cat.offersSent || 0;
            break;

          case "ST":
            row.st = cat.offersSent || 0;
            break;

          case "OBC":
            row.obc = cat.offersSent || 0;
            break;

          case "EWS":
            row.ews = cat.offersSent || 0;
            break;

          case "GEN":
            row.gen = cat.offersSent || 0;
            break;

          default:
            break;
        }

      });

      return row;
    })(),

    nationalOffersAccepted: (() => {
      const row = {
        sc: 0,
        st: 0,
        obc: 0,
        ews: 0,
        gen: 0,

        hi: 0,
        oc: 0,
        vi: 0,
        idd: 0,

        exs: 0,
        dxs: 0,

        total: data.offersAccepted || 0,
      };



      (data.nationalBreakdown || []).forEach((cat) => {
        if (!cat.isDisability) {

          // Temporary mapping for EXS & DXS until backend provides IDs
          const value = cat.offersAccepted || 0;

          if (cat.isExServiceman) {
            const code = exServiceMap[cat.exServicemanGroupId];

            switch (code) {
              case "EXS":
                row.exs = value;
                break;

              case "DXS":
              case "DDXS":
                row.dxs += value;
                break;

              default:
                break;
            }

            return;
          }

          const code = reservationMap[cat.reservationCategoryId];

          switch (code) {
            case "SC":
              row.sc = cat.offersAccepted || 0;
              break;

            case "ST":
              row.st = cat.offersAccepted || 0;
              break;

            case "OBC":
              row.obc = cat.offersAccepted || 0;
              break;

            case "EWS":
              row.ews = cat.offersAccepted || 0;
              break;

            case "GEN":
              row.gen = cat.offersAccepted || 0;
              break;

            default:
              break;
          }

        } else {
          const code = disabilityMap[cat.disabilityCategoryId];

          switch (code) {
            case "HI":
              row.hi = cat.offersAccepted || 0;
              break;

            case "OC":
              row.oc = cat.offersAccepted || 0;
              break;

            case "VI":
              row.vi = cat.offersAccepted || 0;
              break;

            case "ID":
              row.idd = cat.offersAccepted || 0;
              break;

            default:
              break;
          }
        }
      });

      return row;
    })(),

    stateWiseOffersAccepted:
      (data.stateBreakdown || []).map((state) => {

        const stateMaster = masterData?.states?.find(
          (s) =>
            String(s.stateId).trim() ===
            String(state.stateId).trim()
        );

        const cityMaster = masterData?.cities?.find(
          (c) =>
            String(c.cityId).trim() ===
            String(state.cityId).trim()
        );

        const row = {
          stateId: state.stateId,
          cityId: state.cityId,

          state: stateMaster?.stateName || "-",
          city: cityMaster?.cityName || "-",

          sc: 0,
          st: 0,
          obc: 0,
          ews: 0,
          gen: 0,

          hi: 0,
          oc: 0,
          vi: 0,
          idd: 0,

          exs: 0,
          dxs: 0,

          total: state.offersAccepted || 0,
        };


        (state.categories || []).forEach((cat) => {
          if (!cat.isDisability) {

            // Temporary mapping until backend sends EXS/DXS ids
            const value = cat.offersAccepted || 0;

            if (cat.isExServiceman) {
              const code = exServiceMap[cat.exServicemanGroupId];

              switch (code) {
                case "EXS":
                  row.exs = value;
                  break;

                case "DXS":
                case "DDXS":
                  row.dxs += value;
                  break;

                default:
                  break;
              }

              return;
            }

            const code = reservationMap[cat.reservationCategoryId];

            switch (code) {
              case "SC":
                row.sc = cat.offersAccepted || 0;
                break;

              case "ST":
                row.st = cat.offersAccepted || 0;
                break;

              case "OBC":
                row.obc = cat.offersAccepted || 0;
                break;

              case "EWS":
                row.ews = cat.offersAccepted || 0;
                break;

              case "GEN":
                row.gen = cat.offersAccepted || 0;
                break;

              default:
                break;
            }

          } else {

            const code = disabilityMap[cat.disabilityCategoryId];

            switch (code) {
              case "HI":
                row.hi = cat.offersAccepted || 0;
                break;

              case "OC":
                row.oc = cat.offersAccepted || 0;
                break;

              case "VI":
                row.vi = cat.offersAccepted || 0;
                break;

              case "ID":
                row.idd = cat.offersAccepted || 0;
                break;

              default:
                break;
            }
          }
        });

        return row;
      }),
    stateWiseRemaining:
      (data.stateBreakdown || []).map((state) => {

        const stateMaster = masterData?.states?.find(
          (s) =>
            String(s.stateId).trim() ===
            String(state.stateId).trim()
        );

        const cityMaster = masterData?.cities?.find(
          (c) =>
            String(c.cityId).trim() ===
            String(state.cityId).trim()
        );

        const row = {
          stateId: state.stateId,
          cityId: state.cityId,

          state: stateMaster?.stateName || "-",
          city: cityMaster?.cityName || "-",

          sc: 0,
          st: 0,
          obc: 0,
          ews: 0,
          gen: 0,

          hi: 0,
          oc: 0,
          vi: 0,
          idd: 0,

          exs: 0,
          dxs: 0,

          total:
            state.remainingTotalVacancies ??
            ((state.totalVacancies || 0) - (state.onboardedCount || 0)),
        };




        (state.categories || []).forEach((cat) => {
          const value =
            cat.remainingVacancyCount ??
            (cat.vacancyCount || 0) - (cat.onboardedCount || 0);

          if (!cat.isDisability) {

            // Temporary mapping until backend sends EXS/DXS ids
            if (cat.isExServiceman) {
              const code = exServiceMap[cat.exServicemanGroupId];

              switch (code) {
                case "EXS":
                  row.exs = value;
                  break;

                case "DXS":
                case "DDXS":
                  row.dxs += value;
                  break;

                default:
                  break;
              }

              return;
            }

            const code = reservationMap[cat.reservationCategoryId];

            switch (code) {
              case "SC":
                row.sc = value;
                break;

              case "ST":
                row.st = value;
                break;

              case "OBC":
                row.obc = value;
                break;

              case "EWS":
                row.ews = value;
                break;

              case "GEN":
                row.gen = value;
                break;

              default:
                break;
            }

          } else {

            const code = disabilityMap[cat.disabilityCategoryId];

            switch (code) {
              case "HI":
                row.hi = value;
                break;

              case "OC":
                row.oc = value;
                break;

              case "VI":
                row.vi = value;
                break;

              case "ID":
                row.idd = value;
                break;

              default:
                break;
            }
          }
        });

        return row;
      }),


  };
};