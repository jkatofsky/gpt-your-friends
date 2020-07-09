import React from 'react';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import initSqlJs from "sql.js";

class Upload extends React.Component {

    componentDidMount() {
        // ERRORS TODO: add .catch() here
        initSqlJs({ locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.3.0/dist/${file}` }).then(SQL => { this.SQL = SQL; });
    }

    processDB = () => {
        const iMessageDBFile = document.getElementById('upload-db').files[0];
        // ERRORS TODO: verify  that the file has the right name and metadata
        var reader = new FileReader();
        reader.onload = () => {
            var UintArray = new Uint8Array(reader.result);
            const iMessageDB = new this.SQL.Database(UintArray);
            // ERRORS TODO: verify that the database has the right tables + stuff
            this.props.oniMessageDBUpload(iMessageDB);
        }
        reader.readAsArrayBuffer(iMessageDBFile);
    }

    render() {
        return <>
            <p>First, you have to upload your Mac's local iMessage database. Starting from your Finder home directory, the database can be found at <b>Library &gt; Messages &gt; chat.db</b></p>
            <input
                accept=".db"
                style={{ display: 'none' }}
                id="upload-db"
                type="file"
                onChange={this.processDB}
            />
            <label htmlFor="upload-db">
                <Button variant="contained" component="span"
                    startIcon={<CloudUploadIcon />}>Upload iMessage DB</Button>
            </label>
            <p>The only data sent over the internet is the text of a random subset of messages - with no metadata at all. And your messages are soon deleted from the server when you're done with the site.</p>
        </>;
    }
}


export default Upload;