import * as React from 'react';
import InstallationInstructions from './InstallationInstructions';

const packages = {
  Community: '@mui/x-date-pickers@next',
  Pro: '@mui/x-date-pickers-pro@next',
};

const peerDependency = {
  label: 'Date library',
  installationComment: '// Install date library (if not already installed)',
  packages: ['dayjs', 'date-fns', 'luxon', 'moment'],
};

export default function PickersInstallationInstructions() {
  return <InstallationInstructions packages={packages} peerDependency={peerDependency} />;
}
