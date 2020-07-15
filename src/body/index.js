import React from 'react';
import './style.css';
import { isMacOs } from "react-device-detect";
import Grid from '@material-ui/core/Grid';
import ContentBox from '../shared/ContentBox';
import ErrorIcon from '@material-ui/icons/Error';
import Upload from './Upload';
import Train from './Train';
import Generate from './Generate';
import { dimOnTrue } from '../utils/utils';

class Body extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            iMessageDB: null,
            handles: {},
            selectedHandleID: null
        };
    }

    oniMessageDBProcess = (iMessageDB, handles) => {
        this.setState({
            iMessageDB: iMessageDB,
            handles: handles,
            selectedHandleID: null
        });
    }

    onHandleSelect = (handleID) => {
        this.setState({ selectedHandleID: handleID });
    }

    onModelTrain = (handleID, modelID) => {
        let { handles } = this.state;
        handles[handleID].modelID = modelID;
        this.setState({ handles: handles });
    }

    render() {
        const { iMessageDB, handles, selectedHandleID } = this.state;

        const uploadDisabled = !isMacOs;
        const trainDisabled = uploadDisabled || !iMessageDB;
        const generateDisabled = trainDisabled
            || Object.keys(handles).length === 0
            || !selectedHandleID
            || handles[selectedHandleID].model === null;

        return <>

            <Grid container justify="center" alignItems="flex-start" xs={12}>
                <Grid container justify="center" alignItems="flex-start" spacing={2} xs={12} md={11} lg={10}>

                    {!isMacOs && <div className="absolute-child">
                        <ErrorIcon fontSize="large" /><h2 className="error-title">You don't appear to be on macOS. Return to this website from a Mac to use it.</h2>
                    </div>}

                    <Grid item sm={5} xs={11}
                        style={dimOnTrue(uploadDisabled)}>
                        <ContentBox title="Upload iMessages" content={
                            <Upload disabled={uploadDisabled}
                                oniMessageDBProcess={this.oniMessageDBProcess} />
                        } />
                    </Grid>
                    <Grid item sm={6} xs={11}
                        style={dimOnTrue(trainDisabled)}>
                        <ContentBox title="Train Models" content={
                            <Train disabled={trainDisabled}
                                iMessageDB={iMessageDB}
                                handles={handles}
                                selectedHandleID={selectedHandleID}
                                onHandleSelect={this.onHandleSelect}
                                onModelTrain={this.onModelTrain} />
                        } />
                    </Grid>
                    <Grid item xs={11}
                        style={dimOnTrue(generateDisabled)}>
                        <ContentBox title="Generate Text" content={
                            <Generate disabled={generateDisabled}
                                selectedHandle={handles[selectedHandleID]} />
                        } />
                    </Grid>
                </Grid>
            </Grid>
        </>
    }
}

export default Body;