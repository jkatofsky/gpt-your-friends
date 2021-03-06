import React from 'react';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import initSqlJs from "sql.js";
import { disableOnTrue, buttonDisableStyleOnTrue } from '../utils/utils';
import LabelledLoadingCircle from '../shared/LabelledLoadingCircle';

class Upload extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
    }

    componentDidMount() {
        initSqlJs({
            locateFile: file =>
                `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.3.0/dist/${file}`
        }).then(SQL => { this.SQL = SQL; });
    }

    iMessageDBProcess = () => {
        this.setState({ loading: true });
        const iMessageDBFiles = document.getElementById('upload-db').files
        const iMessageDBFile = iMessageDBFiles[iMessageDBFiles.length - 1];
        var reader = new FileReader();
        reader.onload = () => {
            var UintArray = new Uint8Array(reader.result);
            const iMessageDB = new this.SQL.Database(UintArray);
            const handleTable = iMessageDB.exec("select ROWID, id from handle");
            const handles = {};
            handleTable[0].values.forEach(row => {
                handles[row[0]] = {
                    name: row[1],
                    modelID: null
                }
            });
            this.props.oniMessageDBProcess(iMessageDB, handles);
            this.setState({ loading: false });
        }
        reader.readAsArrayBuffer(iMessageDBFile);
    }

    render() {
        const { enabled } = this.props;
        const { loading } = this.state;

        const uploadButtonDisabled = !enabled || loading;

        return <div className="relative-parent">

            {loading &&
                <div className="absolute-child">
                    <LabelledLoadingCircle label="Processing database..." />
                </div>}

            <div style={disableOnTrue(loading)} >
                <h3 ><u>Step 1: Upload iMessages</u></h3>
                <p>
                    First, you have to upload your Mac's local iMessage database.
                It is found at <b>User &gt; Library &gt; Messages &gt; chat.db</b>.
                You may have to <a href="https://osxdaily.com/2020/04/23/always-show-user-library-folder-macos-catalina/" target="_blank" rel="noopener noreferrer">manually make the Library folder visible</a>.
                Messages that are being stored on iCloud can't be accessed.
                </p>
                <br />
                <input
                    accept=".db"
                    style={{ display: 'none' }}
                    id="upload-db"
                    type="file"
                    onChange={this.iMessageDBProcess}
                />
                <label htmlFor="upload-db">
                    <Button variant="contained" className="button" component="span"
                        disabled={uploadButtonDisabled} style={buttonDisableStyleOnTrue(uploadButtonDisabled)}
                        startIcon={<CloudUploadIcon />}>Upload iMessage DB</Button>
                </label>
                <p>
                    RNN Your Friends doesn't send any sensitive metadata to the server
                    and doesn't hold on to your messages.
                </p>
            </div>
        </div >;
    }
}


export default Upload;