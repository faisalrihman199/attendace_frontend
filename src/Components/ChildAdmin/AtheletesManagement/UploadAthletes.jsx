import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useAPI } from '../../../contexts/Apicontext';
import { useNavigate } from 'react-router-dom';

const UploadAthletes = () => {
    const { register, handleSubmit, setValue, reset, watch, formState: { errors } } = useForm();
    const [selectedValue, setSelectedValue] = useState('team');
    const [selectedTeamClass, setSelectedTeamClass] = useState(''); // State for the selected dropdown value
    const [teams, setTeams] = useState([]);
    const [classes, setClasses] = useState([]);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const { allTeams, uploadAthletesCSV } = useAPI(); // Replace with your actual API function for uploading CSV.

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
    const navigate=useNavigate();

    const onSubmit = (data) => {
        if (!file) {
            toast.error("Please upload a CSV file");
            return;
        }
        setLoading(true);

        const formData = new FormData();
        formData.append('file', file);
        if (selectedTeamClass) {
            formData.append('athleteGroupId', selectedTeamClass);
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

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='poppins-regular'>
            <div className="mb-3">
                <label htmlFor="csvFile" className="form-label">Upload CSV</label>
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

            <div className="mb-3">
                <select
                    className="form-select bg_dede p-3"
                    style={{borderRadius:'16px'}}
                    value={selectedTeamClass}
                    onChange={(e) => setSelectedTeamClass(e.target.value)}
                >
                    <option value="">Select {selectedValue === 'team' ? 'Team' : 'Class'}</option>
                    {selectedValue === 'team'
                        ? teams.map((team) => (
                            <option key={team.id} value={team.id}>{team.groupName}</option>
                        ))
                        : classes.map((cls) => (
                            <option key={cls.id} value={cls.id}>{cls.groupName}</option>
                        ))}
                </select>
            </div>

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
