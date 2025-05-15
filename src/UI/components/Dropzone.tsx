import { Flex, FlexProps, Image, Input, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdOutlineCancel } from "react-icons/md";
import { formatBytes, truncateText } from "../../utils/fc";
import { FaFileAlt } from "react-icons/fa";

interface Props extends FlexProps {
  /**
   * @default Click to upload or drag and drop
   */
  label?: string;
  maxFiles?: number;
  /**
   * ["image/png", "image/jpeg"]
   */
  accept?: string[];
  /**
   * in Bytes
   */
  maxFileSize?: number;
  maxFilesRuleMessage?: string;
  maxFileSizeRuleMessage?: string;
  acceptRuleMessage?: string;
  onFileError?: (error: "maxFilesError" | "maxFileSizeError" | "acceptError") => void;
  files: File[];
  setFiles?: React.Dispatch<React.SetStateAction<File[]>>;
  handleFileChange?: (files: File[]) => void;
  removeFile?: (filename: string) => void;
  isDisabled?: boolean;
  idFor?: string;
}

/**
 * setFiles or handleFileChange & removeFile must be provided
 * @param param0
 * @returns
 */
const Dropzone = ({
  idFor,
  label,
  maxFiles,
  maxFileSize,
  handleFileChange,
  accept,
  onFileError,
  removeFile,
  files,
  setFiles,
  maxFileSizeRuleMessage,
  maxFilesRuleMessage,
  acceptRuleMessage,
  isDisabled,
  ...flexProps
}: Props) => {
  if (!setFiles && (!handleFileChange || !removeFile)) {
    throw new Error("setFiles or handleFileChange must be provided");
  }

  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>("");
  const [isFileHovered, setIsFileHovered] = useState(false);

  const handleFiles = (newFiles: FileList) => {
    const validFiles: File[] = [];

    if (!onFileError) {
      setError("");
    }

    if (isDisabled) {
      return;
    }

    Array.from(newFiles).forEach((file) => {
      if (maxFileSize && file.size > maxFileSize) {
        if (onFileError) {
          onFileError("maxFileSizeError");
        } else {
          setError("Maximal file size exceeded");
        }
        return;
      }

      if (accept && !accept.includes(file.type)) {
        if (onFileError) {
          onFileError("acceptError");
        } else {
          setError("File type not allowed");
        }
        return;
      }

      if (!files.some((f) => f.name === file.name && f.size === file.size)) {
        validFiles.push(file);
      }
    });

    if (maxFiles && files.length + validFiles.length > maxFiles) {
      if (onFileError) {
        onFileError("maxFilesError");
      } else {
        setError("Maximal number of files exceeded");
      }
      return;
    }

    if (setFiles) {
      setFiles((prev) => [...prev, ...validFiles]);
    } else {
      handleFileChange?.([...files, ...validFiles]);
    }
  };

  return (
    <>
      <Flex
        as={"label"}
        htmlFor={idFor ?? "fileInput"}
        width={"100%"}
        height={"auto"}
        border="1px dashed #000"
        borderRadius="10px"
        justifyContent={"center"}
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(false);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(false);
          if (e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
          }
        }}
        p={3}
        _hover={{
          cursor: isDisabled ? "not-allowed" : "pointer",
          backgroundColor: isDisabled ? "" : isFileHovered ? "transparent" : "#dadbdd",
        }}
        backgroundColor={isDisabled ? "#c5c7cf" : isDragging ? "#dadbdd" : "transparent"}
        cursor={isDisabled ? "not-allowed" : isDragging ? "copy" : "pointer"}
        {...flexProps}
      >
        <Flex
          display={files.length > 0 ? "none" : "flex"}
          flexDir={"column"}
          justifyContent={"center"}
          alignItems={"center"}
          py={8}
        >
          <AiOutlineCloudUpload fontSize={"30px"} />
          {label ?? "Click to upload or drag and drop"}
          <Flex fontSize={"sm"} fontStyle={"italic"}>
            {maxFileSize &&
              (maxFileSizeRuleMessage ?? "Max file size: " + formatBytes(maxFileSize))}
            {maxFileSize && maxFiles && <Text fontStyle={"normal"}>&nbsp;|&nbsp;</Text>}
            {maxFiles && (maxFilesRuleMessage ?? "Max files: " + maxFiles)}
            {accept && (maxFiles || maxFileSize) && <Text fontStyle={"normal"}>&nbsp;|&nbsp;</Text>}
            {accept && (acceptRuleMessage ?? "Accept: " + accept.join(", "))}
          </Flex>
        </Flex>
        {files.length > 0 && (
          <Flex
            width={"100%"}
            flexGrow={1}
            alignItems={"center"}
            justifyContent={"center"}
            flexWrap={"wrap"}
            gap={4}
          >
            {files.map((file) => {
              return (
                <Flex
                  key={file.name}
                  boxSizing="border-box"
                  wordBreak={"break-word"}
                  flexDir={"column"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  border={"1px solid #000"}
                  borderRadius={"10px"}
                  p={2}
                  width={"126px"}
                  height={"155px"}
                  position={"relative"}
                >
                  <Flex
                    position={"absolute"}
                    top={"-8px"}
                    right={"-8px"}
                    borderRadius={"full"}
                    backgroundColor={"white"}
                    _hover={{ cursor: "pointer" }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsFileHovered(false);
                      if (setFiles) {
                        setFiles((prev) => prev.filter((f) => f.name !== file.name));
                      } else {
                        removeFile?.(file.name);
                      }
                    }}
                  >
                    <MdOutlineCancel
                      className="red-on-hover"
                      fontSize={"18px"}
                      onMouseEnter={(e) => {
                        e.preventDefault();
                        setIsFileHovered(true);
                      }}
                      onMouseLeave={(e) => {
                        e.preventDefault();
                        setIsFileHovered(false);
                      }}
                    />
                  </Flex>
                  <Flex
                    flexDir={"column"}
                    alignItems={"center"}
                    height={"103px"}
                  >
                    {file.type.startsWith("image/") ? (
                      <Image maxH={"85px"} src={URL.createObjectURL(file)} alt={file.name} />
                    ) : file.type === "application/pdf" ? (
                      <iframe
                        src={URL.createObjectURL(file)}
                        width="100%"
                        height="85px"
                        title={file.name}
                      ></iframe>
                    ) : (
                      <FaFileAlt fontSize={"60px"} />
                    )}
                    <Text textAlign={"center"} fontSize={"12px"}>
                      {file.name.length <= 15 ? file.name : truncateText(file.name, 9) + " ." + file.name.split('.').pop()}
                    </Text>
                  </Flex>
                  <Text textAlign={"center"} fontSize={"12px"}>
                    {formatBytes(file.size)}
                  </Text>
                </Flex>
              );
            })}
          </Flex>
        )}
        <Input
          id={idFor ?? "fileInput"}
          type="file"
          aria-label="file input"
          display={"none"}
          disabled={isDisabled}
          accept={accept?.join(",")}
          onChange={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (e.target.files) {
              handleFiles(e.target.files);
            }
          }}
          multiple
        />
      </Flex>
      {error && <Text color={"red"}>{error}</Text>}
    </>
  );
};

export default Dropzone;
