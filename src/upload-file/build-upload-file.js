const buildUploadFile = (
  channel = "",
  filePath = "",
  filename = "",
  title = "",
  initialComment = ""
) => {
  if (!channel) {
    throw new Error("Channel must be set");
  }

  if (!filePath) {
    throw new Error("File path must be set");
  }

  return {
    channel,
    filePath,
    filename,
    title,
    initialComment,
  };
};

export default buildUploadFile;
