import "./lecture-files.scss";

interface LectureFile {
  id: number;
  name: string;
  url: string;
}

interface LectureFilesProps {
  files: LectureFile[];
}

export function LectureFiles({ files }: LectureFilesProps) {
  return (
    <ul className="filesList">
      {files.map((file) => (
        <li key={file.id} className="file">
          <div className="fileInfo">
            <span className="fileName">{file.name}</span>
          </div>
          <a href={file.url} className="downloadButton" download>
            Download
          </a>
        </li>
      ))}
    </ul>
  );
}
