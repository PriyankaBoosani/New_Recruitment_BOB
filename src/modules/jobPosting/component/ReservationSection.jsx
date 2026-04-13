import { Row, Col, Form, Card, Button } from "react-bootstrap";
import ErrorMessage from "../../../shared/components/ErrorMessage";
import edit_icon from "../../../assets/edit_icon.png";
import delete_icon from "../../../assets/delete_icon.png";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import { useState } from "react";
const ReservationSection = ({
    isViewMode,
    formData,
    errors,
    setErrors,
    reservationCategories,
    disabilityCategories,
    states,
    languages,
    cities,
    nationalCategories,
    setNationalCategories,
    nationalDisabilities,
    setNationalDisabilities,
    nationalCategoryTotal,
    currentState,
    setCurrentState,
    stateCategoryTotal,
    filteredLanguages,
    stateDistributions,
    setStateDistributions,
    editingIndex,
    setEditingIndex,
    handleInputChange,
    handleAddOrUpdateState
}) => {
    const { t } = useTranslation(["addPosition", "common", "validation"]);
    const renderError = (e) => {
        if (!e) return "";
        if (typeof e === "string") return t(e);
        if (typeof e === "object" && e.key) return t(e.key, e.params);
        return "";
    };
    const sortedStates = [...states].sort((a, b) =>
        a.name.localeCompare(b.name, 'en', { sensitivity: 'base' })
    );
    // const [cities, setCities] = useState([]);
    // const [loadingCities, setLoadingCities] = useState(false);
    // const fetchCitiesByState = async (stateId) => {
    //     if (!stateId) return;
    //     try {


    //         const res = await masterApiService.getInterviewCentresByState(
    //             ["Regional Office", "Zonal Office"],
    //             stateId
    //         );



    //         setCities(Array.isArray(res.data) ? res.data : []);
    //     } catch (err) {

    //         console.error("ERROR RESPONSE", err?.response || err);
    //     }
    // };
    const filteredCities = cities
        .filter(c => String(c.stateId) === String(currentState.state));

    const sortedCities = [...filteredCities].sort((a, b) =>
        a.name.localeCompare(b.name, 'en', { sensitivity: 'base' })
    );
    return (
        <fieldset disabled={isViewMode}>
            {/* Reservation Section */}
            <Col xs={12} className="mt-4">
                <div className="d-flex justify-content-between align-items-center mb-2 catfonts">
                    <div><h6 className="mb-0 catfont">{t("addPosition:category_wise_reservation")} <span className="text-danger">*</span></h6><small className="text-muted">{t("addPosition:enable_state_distribution_help")}</small></div>
                    <Form.Check
                        type="switch"
                        name="enableStateDistribution"
                        checked={formData.enableStateDistribution}
                        onChange={e => {
                            handleInputChange(e);

                            //  CLEAR NATIONAL DISTRIBUTION ERROR
                            setErrors(prev => ({ ...prev, nationalDistribution: "" }));
                        }}
                    />
                </div>

                {!formData.enableStateDistribution ? (
                    <Row className="g-4">
                        <Col md={7}>
                            <Card className="p-3 genfonts"><h6 className="text-primary mb-3">{t("addPosition:category")}</h6>
                                <Row className="g-3">
                                    {reservationCategories.map(cat => (
                                        <Col md={2} key={cat.id}>
                                            <Form.Label className="small fw-semibold">{cat.code}</Form.Label>
                        <Form.Control
  type="text"
  inputMode="numeric"
  pattern="[0-9]*"
  value={nationalCategories[cat.code] ?? "0"}
  onChange={e => {
    let value = e.target.value;

    // allow only digits
    value = value.replace(/\D/g, "");

    // remove leading zeros (keep single 0)
    if (value.length > 1) {
      value = value.replace(/^0+/, "");
    }

    setNationalCategories(prev => ({
      ...prev,
      [cat.code]: value === "" ? "0" : value
    }));

    setErrors(prev => ({ ...prev, nationalDistribution: "" }));
  }}
  onKeyDown={e => {
    if (
      !/[0-9]/.test(e.key) &&
      !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)
    ) {
      e.preventDefault();
    }
  }}
/>
                                        </Col>
                                    ))}
                                    <Col md={2}><Form.Label className="small fw-semibold">{t("common:total")}</Form.Label><Form.Control disabled value={nationalCategoryTotal} /></Col>
                                </Row>
                            </Card>
                        </Col>
                        <Col md={5}>
                            <Card className="p-3 genfonts"><h6 className="text-primary mb-3">{t("addPosition:disability")}</h6>
                                <Row className="g-3">
                                    {disabilityCategories.map(d => (
                                        <Col md={3} key={d.id}><Form.Label className="small fw-semibold">{d.disabilityCode}</Form.Label>
                                         <Form.Control
  type="text"                 // 🔥 change from number → text
  inputMode="numeric"
  pattern="[0-9]*"
  value={nationalDisabilities[d.disabilityCode] ?? "0"}
  onChange={e => {
    let value = e.target.value;

    // ❌ allow only digits
    value = value.replace(/\D/g, "");

    // ✅ remove leading zeros (but allow single 0)
    if (value.length > 1) {
      value = value.replace(/^0+/, "");
    }

    setNationalDisabilities(prev => ({
      ...prev,
      [d.disabilityCode]: value === "" ? "0" : value
    }));

    setErrors(prev => ({
      ...prev,
      nationalDistribution: ""
    }));
  }}
  onKeyDown={e => {
    if (
      !/[0-9]/.test(e.key) &&
      !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)
    ) {
      e.preventDefault();
    }
  }}
/>
                                        </Col>
                                    ))}
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                ) : (
                    <>
                        <Row className="g-3 mb-3">
                            <Col md={3}><Form.Label>{t("addPosition:state")} <span className="text-danger">*</span></Form.Label>
                                <Select
                                    classNamePrefix="react-select"
                                     isDisabled={isViewMode} 
                                      styles={{
        control: (base, state) => ({
            ...base,
            backgroundColor: isViewMode ? "#e9ecef" : base.backgroundColor,
          //  cursor: isViewMode ? "not-allowed" : "pointer",
            opacity: isViewMode ? 0.8 : 1
        }),
        singleValue: (base) => ({
            ...base,
            color: isViewMode ? "#6c757d" : base.color
        })
    }}
                                    value={[
                                        { value: "", label: t("addPosition:select_state") },
                                        ...states.map(s => ({
                                            value: s.id,
                                            label: s.name
                                        }))
                                    ].find(option => String(option.value) === String(currentState.state))}
                                    onChange={(selected) => {
                                        const stateId = selected ? selected.value : "";

                                        setCurrentState(prev => ({
                                            ...prev,
                                            state: stateId,
                                            city: "",        //  MUST RESET
                                            language: ""
                                        }));

                                        setErrors(prev => ({
                                            ...prev,
                                            state: "",
                                            city: "",
                                            stateLanguage: ""
                                        }));


                                    }}
                                    options={[
                                        { value: "", label: t("addPosition:select_state") },
                                        ...sortedStates.map(s => ({
                                            value: s.id,
                                            label: s.name
                                        }))
                                    ]}
                                />
                                <ErrorMessage>{renderError(errors.state)}</ErrorMessage></Col>
                            <Col md={3}>
                                <Form.Label>
                                    {t("addPosition:city")}
                                </Form.Label>

                                <Select
                                    classNamePrefix="react-select"
                                    isDisabled={!currentState.state}
                                  
                                      styles={{
        control: (base, state) => ({
            ...base,
            backgroundColor: isViewMode ? "#e9ecef" : base.backgroundColor,
          //  cursor: isViewMode ? "not-allowed" : "pointer",
            opacity: isViewMode ? 0.8 : 1
        }),
        singleValue: (base) => ({
            ...base,
            color: isViewMode ? "#6c757d" : base.color
        })
    }}
                                    value={
                                        filteredCities
                                            .map(c => ({
                                                value: c.id,
                                                label: c.name
                                            }))
                                            .find(option => String(option.value) === String(currentState.city)) || null
                                    }
                                    placeholder={t("addPosition:select_city")}
                                    onChange={(selected) => {
                                        setCurrentState(prev => ({
                                            ...prev,
                                            city: selected ? selected.value : "",
                                            cityName: selected ? selected.label : ""
                                        }));

                                        setErrors(prev => ({
                                            ...prev,
                                            city: ""
                                        }));
                                    }}
                                    options={sortedCities.map(c => ({
                                        value: c.id,
                                        label: c.name
                                    }))}
                                />
                            </Col>
                            <Col md={3}><Form.Label>{t("addPosition:vacancies")} <span className="text-danger">*</span></Form.Label><Form.Control
                                type="text"
                                inputMode="numeric"
                                maxLength={10}
                                placeholder={t("addPosition:enter_vacancies_small")}
                                value={currentState.vacancies}
                                onChange={e => {
                                    let value = e.target.value;

                                    // HARD FILTER: digits only
                                    value = value.replace(/\D/g, "");

                                    setCurrentState(prev => ({
                                        ...prev,
                                        vacancies: value
                                    }));

                                    setErrors(prev => ({
                                        ...prev,
                                        stateVacancies: "",
                                        stateDistribution: ""
                                    }));
                                }}
                            />

                                <ErrorMessage>{renderError(errors.stateVacancies)}</ErrorMessage>
                            </Col>
                            <Col md={3}><Form.Label>{t("addPosition:local_language")} <span className="text-danger">*</span></Form.Label>
                                <Select
                                    classNamePrefix="react-select"
                                    isDisabled={!currentState.state}
                                 
                                      styles={{
        control: (base, state) => ({
            ...base,
            backgroundColor: isViewMode ? "#e9ecef" : base.backgroundColor,
          //  cursor: isViewMode ? "not-allowed" : "pointer",
            opacity: isViewMode ? 0.8 : 1
        }),
        singleValue: (base) => ({
            ...base,
            color: isViewMode ? "#6c757d" : base.color
        })
    }}
                                    value={[
                                        { value: "", label: t("addPosition:select_language") },
                                        ...filteredLanguages.map(lang => ({
                                            value: lang.id,
                                            label: lang.name
                                        }))
                                    ].find(option => String(option.value) === String(currentState.language))}
                                    onChange={(selected) => {
                                        setCurrentState(prev => ({
                                            ...prev,
                                            language: selected ? selected.value : ""
                                        }));
                                        setErrors(prev => ({ ...prev, stateLanguage: "" }));
                                    }}
                                    options={[
                                        { value: "", label: t("addPosition:select_language") },
                                        ...filteredLanguages.map(lang => ({
                                            value: lang.id,
                                            label: lang.name
                                        }))
                                    ]}
                                />

                                <ErrorMessage>{renderError(errors.stateLanguage)}</ErrorMessage>
                            </Col>

                            <Col md={3} className="d-flex align-items-end">
                                <Form.Check
                                    type="checkbox"
                                    label="Is proficient in local language required?"
                                    checked={currentState.isProficientInLocalLanguage || false}
                                    onChange={(e) => {
                                        setCurrentState(prev => ({
                                            ...prev,
                                            isProficientInLocalLanguage: e.target.checked
                                        }));
                                    }}
                                    className="custom_checkbox"
                                />
                            </Col>
                        </Row>
                        <Row className="g-4 mt-3">
                            <Col md={7}>
                                <Card className="p-3 h-100 genfonts"><h6 className="text-primary mb-3">{t("addPosition:category")}</h6>
                                    <Row className="g-3">
                                        {reservationCategories.map(cat => (
                                            <Col md={2} key={cat.id}><Form.Label className="small fw-semibold">{cat.code}</Form.Label>
                                     <Form.Control
  type="text"
  inputMode="numeric"
  pattern="[0-9]*"
  value={currentState.categories?.[cat.code] ?? 0}
  onChange={e => {
    let value = e.target.value;

    //  keep only digits
    value = value.replace(/\D/g, "");

    setCurrentState(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [cat.code]: Number(value || 0)
      }
    }));

    setErrors(prev => ({
      ...prev,
      stateDistribution: ""
    }));
  }}
  onKeyDown={e => {
    //  block anything except digits + control keys
    if (
      !/[0-9]/.test(e.key) &&
      !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)
    ) {
      e.preventDefault();
    }
  }}
  onPaste={e => {
    //  block paste if it contains non-digits
    const paste = e.clipboardData.getData("text");
    if (!/^\d+$/.test(paste)) {
      e.preventDefault();
    }
  }}
/>
                                            </Col>
                                        ))}
                                        <Col md={2}><Form.Label className="small fw-semibold">{t("common:total")}</Form.Label><Form.Control disabled value={stateCategoryTotal} /></Col>
                                    </Row>
                                </Card>
                            </Col>
                            <Col md={5}>
                                <Card className="p-3 h-100 genfonts"><h6 className="text-primary mb-3"> {t("addPosition:disability")}</h6>
                                    <Row className="g-3">
                                        {disabilityCategories.map(d => (
                                            <Col md={3} key={d.id}><Form.Label className="small fw-semibold">{d.disabilityCode}</Form.Label>
<Form.Control
  type="text"
  inputMode="numeric"
  pattern="[0-9]*"
  value={currentState.disabilities?.[d.disabilityCode] ?? "0"}
  onChange={e => {
    let value = e.target.value;

    // allow only digits
    value = value.replace(/\D/g, "");

    // remove leading zeros (keep single 0)
    if (value.length > 1) {
      value = value.replace(/^0+/, "");
    }

    setCurrentState(prev => ({
      ...prev,
      disabilities: {
        ...prev.disabilities,
        [d.disabilityCode]: value === "" ? "0" : value
      }
    }));

    setErrors(prev => ({
      ...prev,
      stateDistribution: ""
    }));
  }}
  onKeyDown={e => {
    if (
      !/[0-9]/.test(e.key) &&
      !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)
    ) {
      e.preventDefault();
    }
  }}
/>

                                            </Col>
                                        ))}
                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                        <ErrorMessage>{renderError(errors.stateDistribution)}</ErrorMessage>


                        <div className="addsubmitbtn">
                            <Button className="mt-3 addstatefont" onClick={handleAddOrUpdateState}>{editingIndex !== null
                                ? t("addPosition:update_state")
                                : t("addPosition:add_state")}</Button>
                        </div>
                        <div className="table-responsive mt-4">
                            <table className="table table-bordered">

                                <thead>
                                    {/* ===== HEADER ROW 1 ===== */}
                                    <tr>
                                        <th>{t("addPosition:sno")}</th>
                                        <th style={{width: '15%'}}>{t("addPosition:state_name")}</th>
                                        <th style={{width: '15%'}}>{t("addPosition:city_name")}</th>
                                        <th>{t("addPosition:vacancies")}</th>
                                        <th>{t("addPosition:local_language_of_state")}</th>

                                        {reservationCategories.map(c => (
                                            <th key={c.code}>{c.code}</th>
                                        ))}

                                        <th>{t("common:total")}</th>

                                        {/* GROUP HEADER */}
                                        <th colSpan={disabilityCategories.length + 1} className="text-center bgcol">
                                            {t("addPosition:out_of_which")}
                                        </th>



                                        <th className="text-center">{t("common:actions")}</th>
                                    </tr>

                                    {/* ===== HEADER ROW 2 ===== */}
                                    <tr>
                                        {/* Skip earlier columns */}
                                        <th colSpan={5 + reservationCategories.length + 1} />

                                        {disabilityCategories.map(d => (
                                            <th key={d.disabilityCode} className="text-left">
                                                {d.disabilityCode}
                                            </th>
                                        ))}

                                        {/* Disability TOTAL (belongs to Out of Which) */}
                                        <th className="text-left">{t("common:total")}</th>

                                        {/* Actions column */}
                                        <th />
                                    </tr>

                                </thead>

                                <tbody>
                                    {stateDistributions
                                        .filter(row => !row.__deleted)
                                        .map((row, idx) => (

                                            <tr key={idx}>
                                                <td>{idx + 1}</td><td>{states.find(s => s.id === row.state)?.name}</td><td>
                                                    {cities.find(c => String(c.id) === String(row.city))?.name || "-"}
                                                </td><td>{row.vacancies}</td><td>{languages.find(l => l.id === row.language)?.name}</td>
                                                {reservationCategories.map(c => <td key={c.code}>{row.categories?.[c.code] ?? 0}</td>)}
                                                <td>{Object.values(row.categories || {}).reduce((a, b) => a + Number(b || 0), 0)}</td>
                                                {disabilityCategories.map(d => <td key={d.disabilityCode}>{row.disabilities?.[d.disabilityCode] ?? 0}</td>)}
                                                <td>{Object.values(row.disabilities || {}).reduce((a, b) => a + Number(b || 0), 0)}</td>
                                                <td className="text-center"><Button size="sm" variant="link" onClick={() => { setEditingIndex(idx); setCurrentState({ ...row }); }}><img src={edit_icon} alt="edit_icon" className="icon-16" /></Button><Button size="sm" variant="link" className="text-danger" onClick={() => {
                                                    setStateDistributions(prev =>
                                                        prev.map((s, i) =>
                                                            i === idx ? { ...s, __deleted: true } : s
                                                        )
                                                    );

                                                    // if deleting the row being edited
                                                    if (editingIndex === idx) {
                                                        setEditingIndex(null);
                                                        setCurrentState({
                                                            state: "",
                                                            vacancies: "",
                                                            language: "",
                                                            categories: {},
                                                            disabilities: {},
                                                            isProficientInLocalLanguage: false
                                                        });
                                                    }
                                                }}
                                                ><img src={delete_icon} alt="delete_icon" className="icon-16" /></Button></td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
                <ErrorMessage>{renderError(errors.nationalDistribution)}</ErrorMessage>

            </Col>
        </fieldset>
    );
};

export default ReservationSection;
