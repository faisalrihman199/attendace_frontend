import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useAPI } from '../../../contexts/Apicontext';
import { useNavigate } from 'react-router-dom';
import { FaDownload } from 'react-icons/fa6';

const UploadAthletes = () => {
    const { register, handleSubmit, setValue, reset, watch, formState: { errors } } = useForm();
    const [selectedValue, setSelectedValue] = useState('team');
    const [selectedTeamClass, setSelectedTeamClass] = useState(''); // State for the selected dropdown value
    const [teams, setTeams] = useState([]);
    const [classes, setClasses] = useState([]);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const { allTeams, uploadAthletesCSV } = useAPI(); // Replace with your actual API function for uploading CSV.
    const [selectedGroups, setSelectedGroups] = useState([])
    const selectedIds = selectedGroups.map(team => team.id);
    const filteredTeams = teams.filter(team => !selectedIds.includes(team.id));
    const filteredClasses = classes.filter(clas => !selectedIds.includes(clas.id));
    // Fetch teams and classes from API
    useEffect(() => {
        allTeams()
            .then((res) => {
                console.log("Teams Data:", res);
                setTeams(res.data.teams);
                setClasses(res.data.classes);
            })
            .catch((err) => {
                console.error("Error:", err);
            });
    }, [allTeams]);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };
    const navigate = useNavigate();

    const onSubmit = (data) => {
        if (!file) {
            toast.error("Please upload a CSV file");
            return;
        }
        setLoading(true);

        const formData = new FormData();
        formData.append('file', file);
        if (selectedIds) {

            selectedIds.forEach(id => {
                formData.append('athleteGroupIds[]', id);
            });
        }


        uploadAthletesCSV(formData)
            .then((res) => {
                if (res.success) {
                    toast.success(res.message);
                    reset();
                    setFile(null);
                    setSelectedTeamClass('');
                    navigate('/admin/athletes')
                } else {
                    toast.error(res.message);
                }
            })
            .catch((err) => {
                console.error("Error uploading file:", err);
                toast.error("Failed to upload athletes");
            })
            .finally(() => {
                setLoading(false);
            });
    };
    const handleGroupSelect = (val) => {
        const selection = JSON.parse(val && val)
        console.log("Selection is :", selection);
        setSelectedGroups((prevGroups) => [...prevGroups, selection]);
        console.log("Selected Groups :", selectedGroups);
    }
    const handleRemoveGroup = (group) => {
        const id = group.id;
        setSelectedGroups((prevSelectedGroups) =>
            prevSelectedGroups.filter(group => group.id !== id)
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='poppins-regular'>
            <div className="mb-3">
                <div className="flex align-items-center">

                    <label htmlFor="csvFile" className="form-label mt-1">Upload CSV/Excel File</label>
                    <span>
                        <a
                            href="/sample.xlsx"
                            className='mx-2 fw-bold mt-1 text-success'
                            download="sample.xlsx"
                            target='blank'
                            style={{ textDecoration: 'none' }}
                        >
                            (Sample
                            <FaDownload className='ms-2' />)
                        </a>
                    </span>
                </div>
                <input
                    type="file"
                    id="csvFile"
                    className="form-control bg_dede "
                    accept=".csv, .xls, .xlsx"
                    onChange={handleFileChange}
                />
                {errors.file && <span className="text-danger">{errors.file.message}</span>}
            </div>

            <div className="mb-3">
                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="radio"
                        name="teamClassRadio"
                        id="teamRadio"
                        value="team"
                        checked={selectedValue === 'team'}
                        onChange={() => setSelectedValue('team')}
                    />
                    <label className="form-check-label" htmlFor="teamRadio">Team</label>
                </div>
                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="radio"
                        name="teamClassRadio"
                        id="classRadio"
                        value="class"
                        checked={selectedValue === 'class'}
                        onChange={() => setSelectedValue('class')}
                    />
                    <label className="form-check-label" htmlFor="classRadio">Class</label>
                </div>
            </div>

            <div className="row mb-3">
                <div className="col-sm-12">
                    <select
                        className="form-select p-2 bg_dede"

                        onChange={(e) => handleGroupSelect(e.target.value)}

                    >
                        <option value="">Select {selectedValue === 'team' ? 'Team' : 'Class'} Name</option>
                        {selectedValue === 'team'
                            ? filteredTeams.map((team) => (
                                <option key={team.id} value={JSON.stringify(team)}>
                                    {team.groupName}
                                </option>
                            ))
                            : filteredClasses.map((cls) => (
                                <option key={cls.id} value={JSON.stringify(cls)}>
                                    {cls.groupName}
                                </option>
                            ))}
                    </select>
                </div>
            </div>

            {selectedGroups &&
                selectedGroups.map((group, index) => (
                    <div
                        key={index}
                        className="d-inline-flex flex-wrap mx-2 align-items-center bg-light border rounded-pill px-2 py-1 my-2"
                    >
                        <span className="me-2 text-sm">{group.groupName}</span>
                        <button
                            type="button"
                            className="btn-close text-danger btn-xs"
                            aria-label="Close"
                            onClick={() => handleRemoveGroup(group)}
                        ></button>
                    </div>
                ))}


            <div className="d-flex justify-content-end">
                {loading ? (
                    <>
                        <span className="spinner-border spinner-border-sm me-2 " role="status" aria-hidden="true"></span>
                        Uploading...
                    </>
                ) : (
                    <button type="submit" className="btn mx-2 rounded btns poppins-medium">Upload</button>
                )}
            </div>
        </form>
    );
};

export default UploadAthletes;
