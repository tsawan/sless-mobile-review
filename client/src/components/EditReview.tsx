import * as React from "react";
import { Form, Button } from "semantic-ui-react";
import { getUploadUrl, uploadFile } from "../api/reviews-api";
import { useState } from "react";
import { useToast } from "@chakra-ui/core";

enum UploadState {
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile,
}

const EditReview = (props: any) => {
  const toast = useToast();
  const [file, setFile] = useState();
  const [uploadState, setUploadState] = useState(UploadState.NoUpload);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setFile(files[0]);
  };

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    try {
      if (!file) {
        toast({
          title: "Error",
          description: "No file selected",
          status: "error",
          duration: 4000,
        });
        return;
      }

      setUploadState(UploadState.FetchingPresignedUrl);
      const uploadUrl = await getUploadUrl(
        props.auth.getIdToken(),
        props.match.params.reviewId
      );

      setUploadState(UploadState.UploadingFile);
      await uploadFile(uploadUrl, file);

      toast({
        title: "File Uploaded",
        description: "File was uploaded successfully",
        status: "success",
        duration: 2000,
      });
    } catch (e) {
      toast({
        title: "Error",
        description: "Could not upload a file: " + e.message,
        status: "error",
        duration: 4000,
      });      
    } finally {
      setUploadState(UploadState.NoUpload);
    }
  };

  const renderButton = () => {
    return (
      <div>
        {uploadState === UploadState.FetchingPresignedUrl && (
          <p>Uploading image metadata</p>
        )}
        {uploadState === UploadState.UploadingFile && <p>Uploading file</p>}
        <Button loading={uploadState !== UploadState.NoUpload} type="submit">
          Upload
        </Button>
      </div>
    );
  };

  return (
    <div>
      <h1>Upload new image</h1>

      <Form onSubmit={handleSubmit}>
        <Form.Field>
          <label>File</label>
          <input
            type="file"
            accept="image/*"
            placeholder="Image to upload"
            onChange={handleFileChange}
          />
        </Form.Field>

        {renderButton()}
      </Form>
    </div>
  );
};

export default EditReview;
