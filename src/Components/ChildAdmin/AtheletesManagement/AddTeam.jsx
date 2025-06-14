import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAPI } from '../../../contexts/Apicontext';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { showToastNotification } from '../../Utilities/toastNotification';
import AddSchedule from './AddSchedule';
import { FaTrashAlt } from 'react-icons/fa';

const AddTeam = () => {
  const [selectedValue, setSelectedValue] = useState('team');
  const { register, getValues, setValue } = useForm();
  const [loading, setLoading] = useState(false);
  const { addTeam, getSchedules, deleteSchedule } = useAPI();
  const location = useLocation();
  const navigate = useNavigate();
  const { team } = location.state || {};

  // Scheduling states
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [scheduleLoading, setScheduleLoading] = useState(false);

  // Set form values if editing
  useEffect(() => {
    if (team) {
      setSelectedValue(team.category);
      setValue('groupName', team.groupName);
      fetchSchedules();
    }
  }, [team]);

  const handleRadioChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleGroup = () => {
    if (!getValues('groupName')) {
      toast.error("Please Add Team/Class Name");
      return;
    }
    setLoading(true);
    const data = {
      groupName: getValues('groupName'),
      category: selectedValue
    };
    addTeam(data, team?.id)
      .then((res) => {
        if (res.success) {
          toast.success(res.message);
          navigate('/admin/teams');
        } else {
          toast.error(res.message);
        }
      })
      .catch((err) => {
        console.log("Error :", err);
        toast.error(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const returnToTeamManage = () => {
    const functionsMap = {
      navigateAway: () => navigate('/admin/teams'),
      stayOnPage: () => console.log('Staying on the page...'),
    };
    try {
      const inputElement = document.getElementById('groupName');
      const inputValue = inputElement.value;
      if ((!team && inputValue === '') || (team?.groupName === inputValue)) {
        navigate('/admin/teams');
      } else {
        showToastNotification({
          message: 'You have unsaved changes. Are you sure you want to cancel?',
          confirmText: 'Confirm',
          confirmFunction: 'navigateAway',
          cancelText: 'Cancel',
          cancelFunction: 'stayOnPage',
          functionsMap
        });
      }
    } catch (err) {
      console.log("Error :", err);
      toast.error(err.message);
    }
  };

  const fetchSchedules = async () => {
    if (!team?.id) return;
    setScheduleLoading(true);
    try {
      const res = await getSchedules(team.id);
      if (res.success) setSchedules(res.schedules || []);
      else toast.error(res.message);
    } catch (err) {
      toast.error("Failed to fetch schedules");
    } finally {
      setScheduleLoading(false);
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    try {

      const res = await deleteSchedule(scheduleId);
      if (res.success) {
        toast.success("Schedule deleted");
        fetchSchedules();
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error("Deletion failed");
    }
  };

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
        <div className="col-sm-12 tooltip-container">
          <label htmlFor="groupName" className="form-label">
            Team/Class Name
          </label>
          <span className="tooltip-text-right">Input the name of your team or class</span>
          <input
            type="text"
            id="groupName"
            className="form-control p-2 bg_dede"
            placeholder="Team/Class Name"
            {...register('groupName')}
          />
        </div>
      </div>

      <div className="d-flex my-2 justify-content-end">
        <button
          className="btn rounded color_bao poppins-medium"
          onClick={returnToTeamManage}
          style={{ borderColor: '#247BA0', width: '180px' }}
        >
          Cancel
        </button>
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            {team ? 'Saving...' : 'Adding...'}
          </>
        ) : (
          <button
            className="btn mx-2 rounded btns poppins-medium"
            onClick={handleGroup}
            style={{ width: '180px' }}
          >
            {team ? 'Save' : 'Add'}
          </button>
        )}
      </div>

      {/* 👇 Show Schedule Controls */}
      {team?.id && (
        <>
          <div className="my-4">
            <button
              className="btn rounded color_bao poppins-medium"
              onClick={() => setShowScheduleForm(!showScheduleForm)}
              style={{ borderColor: '#247BA0', width: '180px', fontSize:'15px' }}
            >
              {showScheduleForm ? 'Close Schedule Edit' : 'Update a Schedule'}
            </button>
          </div>

          {showScheduleForm && (
            <AddSchedule groupId={team.id} onSaved={fetchSchedules} />
          )}

          {/* 📋 Schedule Table */}
          <div className="mt-4">
            <h5 className="fw-semibold mb-3">Current Schedules</h5>
            {scheduleLoading ? (
              <p>Loading schedules...</p>
            ) : schedules.length === 0 ? (
              <p className="text-muted">No schedules set yet.</p>
            ) : (
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>Day</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {schedules.map((s) => (
                    <tr key={s.id}>
                      <td>{s.dayOfWeek}</td>
                      <td>{s.startTime}</td>
                      <td>{s.endTime}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger me-2"
                          onClick={() => handleDeleteSchedule(s.id)}
                        >
                          <FaTrashAlt />
                        </button>
                        {/* Add edit button here if needed */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default AddTeam;
