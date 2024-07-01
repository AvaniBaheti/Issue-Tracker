import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { IssueStatus } from '../models/IssueStatus';
import { FaRegCircle, FaCheckCircle, FaSpinner } from 'react-icons/fa';

interface StatusDropdownProps {
  status: IssueStatus;
  onChange: (status: IssueStatus) => void;
}

const StatusDropdown = ({ status, onChange }:StatusDropdownProps) => {
  const getStatusIcon = (status: IssueStatus) => {
    switch (status) {
      case IssueStatus.OPEN:
        return <FaRegCircle />;
      case IssueStatus.CLOSED:
        return <FaCheckCircle />;
      case IssueStatus.IN_PROGRESS:
        return <FaSpinner />;
      default:
        return null;
    }
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="flex items-center px-4 py-2 border rounded-md">
          {getStatusIcon(status)}
          <span className="ml-2">{status}</span>
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="p-2 border rounded-md shadow-lg bg-white">
          <DropdownMenu.Item onSelect={() => onChange(IssueStatus.OPEN)} className="flex items-center p-2 cursor-pointer">
            <FaRegCircle className="mr-2" /> Open
          </DropdownMenu.Item>
          <DropdownMenu.Item onSelect={() => onChange(IssueStatus.CLOSED)} className="flex items-center p-2 cursor-pointer">
            <FaCheckCircle className="mr-2" /> Closed
          </DropdownMenu.Item>
          <DropdownMenu.Item onSelect={() => onChange(IssueStatus.IN_PROGRESS)} className="flex items-center p-2 cursor-pointer">
            <FaSpinner className="mr-2" /> In Progress
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default StatusDropdown;
