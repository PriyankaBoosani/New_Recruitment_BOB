import { Row, Col, Form, Card, Button } from "react-bootstrap";
import ErrorMessage from "../../../shared/components/ErrorMessage";
import edit_icon from "../../../assets/edit_icon.png";
import delete_icon from "../../../assets/delete_icon.png";

const ReservationSection = ({
    isViewMode,
    formData,
    errors,
    setErrors,
    reservationCategories,
    disabilityCategories,
    states,
    languages,
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
    return (
        <fieldset disabled={isViewMode}>
            {/* Reservation Section */}
            <Col xs={12} className="mt-4">
                <div className="d-flex justify-content-between align-items-center mb-2 catfonts">
                    <div><h6 className="mb-0 catfont">Category Wise Reservation <span className="text-danger">*</span></h6><small className="text-muted">Enable to distribute vacancies across states</small></div>
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
                            <Card className="p-3 genfonts"><h6 className="text-primary mb-3">General Category</h6>
                                <Row className="g-3">
                                    {reservationCategories.map(cat => (
                                        <Col md={2} key={cat.id}>
                                            <Form.Label className="small fw-semibold">{cat.code}</Form.Label>
                                            <Form.Control
                                                type="number"
                                                value={nationalCategories[cat.code] ?? 0}
                                                onChange={e => {
                                                    setNationalCategories(prev => ({
                                                        ...prev,
                                                        [cat.code]: Number(e.target.value || 0)
                                                    }));

                                                    //  CLEAR NATIONAL DISTRIBUTION ERROR
                                                    setErrors(prev => ({ ...prev, nationalDistribution: "" }));
                                                }}
                                            />
                                        </Col>
                                    ))}
                                    <Col md={2}><Form.Label className="small fw-semibold">Total</Form.Label><Form.Control disabled value={nationalCategoryTotal} /></Col>
                                </Row>
                            </Card>
                        </Col>
                        <Col md={5}>
                            <Card className="p-3 genfonts"><h6 className="text-primary mb-3">Disability Category</h6>
                                <Row className="g-3">
                                    {disabilityCategories.map(d => (
                                        <Col md={3} key={d.id}><Form.Label className="small fw-semibold">{d.disabilityCode}</Form.Label>
                                            <Form.Control type="number" value={nationalDisabilities[d.disabilityCode] ?? 0} onChange={e => {
                                                setNationalDisabilities(prev => ({
                                                    ...prev,
                                                    [d.disabilityCode]: Number(e.target.value || 0)
                                                }));

                                                //  CLEAR CROSS-FIELD ERROR
                                                setErrors(prev => ({
                                                    ...prev,
                                                    nationalDistribution: ""
                                                }));
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
                            <Col md={4}><Form.Label>State <span className="text-danger">*</span></Form.Label><Form.Select
                                value={currentState.state}
                                onChange={e => {
                                    setCurrentState(prev => ({ ...prev, state: e.target.value }));
                                    setErrors(prev => ({ ...prev, state: "" }));
                                }} >
                                <option value="">Select State</option>{states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</Form.Select>
                                <ErrorMessage>{errors.state}</ErrorMessage></Col>
                            <Col md={4}><Form.Label>Vacancies <span className="text-danger">*</span></Form.Label><Form.Control
                                type="number"
                                value={currentState.vacancies}
                                onChange={e => {
                                    setCurrentState(prev => ({
                                        ...prev,
                                        vacancies: e.target.value
                                    }));

                                    setErrors(prev => ({
                                        ...prev,
                                        stateVacancies: "",
                                        stateDistribution: ""   // CLEAR CROSS-FIELD ERROR
                                    }));
                                }}

                            />
                                <ErrorMessage>{errors.stateVacancies}</ErrorMessage>
                            </Col>
                            <Col md={4}><Form.Label>Local Language <span className="text-danger">*</span></Form.Label>
                                <Form.Select
                                    value={currentState.language}
                                    disabled={!currentState.state}
                                    onChange={e => {
                                        setCurrentState(prev => ({
                                            ...prev,
                                            language: e.target.value
                                        }));
                                        setErrors(prev => ({ ...prev, stateLanguage: "" }));
                                    }}
                                >
                                    <option value="">Select Language</option>
                                    {filteredLanguages.map(lang => (
                                        <option key={lang.id} value={lang.id}>
                                            {lang.name}
                                        </option>
                                    ))}
                                </Form.Select>

                                <ErrorMessage>{errors.stateLanguage}</ErrorMessage></Col>
                        </Row>
                        <Row className="g-4 mt-3">
                            <Col md={7}>
                                <Card className="p-3 h-100 genfonts"><h6 className="text-primary mb-3">General Category</h6>
                                    <Row className="g-3">
                                        {reservationCategories.map(cat => (
                                            <Col md={2} key={cat.id}><Form.Label className="small fw-semibold">{cat.code}</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    value={currentState.categories?.[cat.code] ?? 0}
                                                    onChange={e => {
                                                        setCurrentState(prev => ({
                                                            ...prev,
                                                            categories: {
                                                                ...prev.categories,
                                                                [cat.code]: Number(e.target.value || 0)
                                                            }
                                                        }));

                                                        // 🔥 CLEAR CROSS-FIELD ERROR
                                                        setErrors(prev => ({
                                                            ...prev,
                                                            stateDistribution: ""
                                                        }));
                                                    }}
                                                />
                                            </Col>
                                        ))}
                                        <Col md={2}><Form.Label className="small fw-semibold">Total</Form.Label><Form.Control disabled value={stateCategoryTotal} /></Col>
                                    </Row>
                                </Card>
                            </Col>
                            <Col md={5}>
                                <Card className="p-3 h-100 genfonts"><h6 className="text-primary mb-3">Disability Category</h6>
                                    <Row className="g-3">
                                        {disabilityCategories.map(d => (
                                            <Col md={3} key={d.id}><Form.Label className="small fw-semibold">{d.disabilityCode}</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    value={currentState.disabilities?.[d.disabilityCode] ?? 0}
                                                    onChange={e => {
                                                        setCurrentState(prev => ({
                                                            ...prev,
                                                            disabilities: {
                                                                ...prev.disabilities,
                                                                [d.disabilityCode]: Number(e.target.value || 0)
                                                            }
                                                        }));

                                                        // 🔥 CLEAR CROSS-FIELD ERROR
                                                        setErrors(prev => ({
                                                            ...prev,
                                                            stateDistribution: ""
                                                        }));
                                                    }}
                                                />

                                            </Col>
                                        ))}
                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                        <ErrorMessage>{errors.stateDistribution}</ErrorMessage>

                        <div className="addsubmitbtn">
                            <Button className="mt-3 addstatefont" onClick={handleAddOrUpdateState}>{editingIndex !== null ? "Update State" : "Add State"}</Button>
                        </div>
                        <div className="table-responsive mt-4">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th rowSpan="2">S No.</th>
                                        <th rowSpan="2">State Name</th>
                                        <th rowSpan="2">Vacancies</th>
                                        <th rowSpan="2">Local Language of State</th>

                                        {/* Reservation categories */}
                                        {reservationCategories.map(c => (
                                            <th key={c.code} rowSpan="2">{c.code}</th>
                                        ))}

                                        <th rowSpan="2">TOTAL</th>

                                        <th colSpan={disabilityCategories.length} className="text-center">
                                            Out of Which
                                        </th>
                                        <th rowSpan="2">TOTAL</th>

                                        <th rowSpan="2" className="text-center">Actions</th>
                                    </tr>

                                    <tr>
                                        {/* Disability categories */}
                                        {disabilityCategories.map(d => (
                                            <th key={d.disabilityCode}>{d.disabilityCode}</th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody>
                                    {stateDistributions
                                        .filter(row => !row.__deleted)
                                        .map((row, idx) => (

                                            <tr key={idx}>
                                                <td>{idx + 1}</td><td>{states.find(s => s.id === row.state)?.name}</td><td>{row.vacancies}</td><td>{languages.find(l => l.id === row.language)?.name}</td>
                                                {reservationCategories.map(c => <td key={c.code}>{row.categories?.[c.code] ?? 0}</td>)}
                                                <td>{Object.values(row.categories || {}).reduce((a, b) => a + Number(b || 0), 0)}</td>
                                                {disabilityCategories.map(d => <td key={d.disabilityCode}>{row.disabilities?.[d.disabilityCode] ?? 0}</td>)}
                                                <td>{Object.values(row.disabilities || {}).reduce((a, b) => a + Number(b || 0), 0)}</td>
                                                <td className="text-center"><Button size="sm" variant="link" className="p-0" onClick={() => { setEditingIndex(idx); setCurrentState({ ...row }); }}><img src={edit_icon} alt="edit_icon" className="icon-16" /></Button><Button size="sm" variant="link" className="text-danger" onClick={() => {
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
                                                            disabilities: {}
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
                <ErrorMessage>{errors.nationalDistribution}</ErrorMessage>

            </Col>
        </fieldset>
    );
};

export default ReservationSection;
