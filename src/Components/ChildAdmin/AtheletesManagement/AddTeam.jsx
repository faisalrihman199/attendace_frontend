import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useAPI } from '../../../contexts/Apicontext';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';

const AddTeam = () => {
    const [selectedValue, setSelectedValue] = useState('team');
    const { register, handleSubmit, getValues, setValue } = useForm();
    const [loading, setLoading] = useState(false);
    const { addTeam } = useAPI();
    const location = useLocation();
    const navigate=useNavigate();
    const { team } = location.state || {};
    const handleRadioChange = (event) => {
        setSelectedValue(event.target.value);
    };
    useEffect(()=>{
        if(team){
            console.log("Team here is :", team);
            
            setSelectedValue(team.category);
            setValue('groupName', team.groupName);
        }
    },[])
    const handleGroup = () => {
        if (!getValues('groupName')) {
            toast.error("Please Add Team/Clas Name");
            return
        }
        setLoading(true);
        const data = {
            groupName: getValues('groupName'),
            category: selectedValue
        }
        addTeam(data,team?.id)
            .then((res) => {
                if (res.success) {
                    toast.success(res.message);
                    navigate('/admin/teams')
                }
                else {
                    toast.error(res.message);
                }
            })
            .catch((err) => {
                console.log("Error :", err);
                toast.error(err.message);
            })
            .finally(() => {
                setLoading(false);
            })

    }
    return (
        <>
            <div className="my-3">
                <div className='d-flex'>
                    <div className="form-check mx-2">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="teamClassRadio"
                            id="teamRadio"
                            value="team"
                            checked={selectedValue === 'team'}
                            onChange={handleRadioChange}
                        />
                        <label className="form-check-label" htmlFor="teamRadio" style={{ color: 'black' }}>
                            Team
                        </label>
                    </div>

                    <div className="form-check mx-2">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="teamClassRadio"
                            id="classRadio"
                            value="class"
                            checked={selectedValue === 'class'}
                            onChange={handleRadioChange}
                        />
                        <label className="form-check-label" htmlFor="classRadio" style={{ color: 'black' }}>
                            Class
                        </label>
                    </div>
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-sm-12">
                    <input
                        type="text"
                        className="form-control p-2 bg_dede"
                        placeholder='Team/Class Name'
                        {...register('groupName')}
                    />
                </div>
            </div>
            <div className="d-flex my-2 justify-content-end">
                <button className="btn rounded color_bao poppins-medium " onClick={() => { setValue('groupName', '') }} style={{ borderColor: '#247BA0', width: '180px' }}>
                    Cancel
                </button>
                {
                    loading ?
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Adding ...
                        </>
                        :
                        <button className="btn mx-2 rounded  btns poppins-medium  " onClick={handleGroup} style={{ width: '180px' }}>
                            Add
                        </button>
                }
            </div>
        </>
    )
}

export default AddTeam