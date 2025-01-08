import "./course-header.scss";

interface Course {
  title: string;
  description: string;
}

interface CourseHeaderProps {
  course: Course;
  onBackClick: () => void;
  onQuitClick: () => void;
}

export function CourseHeader({
  course,
  onBackClick,
  onQuitClick,
}: CourseHeaderProps) {
  return (
    <header className="header">
      <button className="backButton" onClick={onBackClick}>
        Back
      </button>
      <div className="courseInfo">
        <h2>{course.title}</h2>
        <p>{course.description}</p>
      </div>
      <div className="actions">
        <button className="review">Write a Review</button>
        <button className="quit" onClick={onQuitClick}>
          Quit
        </button>
      </div>
    </header>
  );
}
