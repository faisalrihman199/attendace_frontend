import React from "react";
import ReactLoading from "react-loading";

const Loading = () => {
    return (
        <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: '100%' }} // Makes the loader fill the height of its parent container
        >
            <ReactLoading type="spokes" color="#247BA0" />
        </div>
    );
};

export default Loading;
