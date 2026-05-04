import { initials } from "../../utils/project";

export default function AvatarStack({ members }) {
  return (
    <span className="avatar-stack">
      {members.slice(0, 3).map((member) => (
        <i key={member.id}>{initials(member.user.name)}</i>
      ))}
      {members.length > 3 ? <i>+{members.length - 3}</i> : null}
    </span>
  );
}
