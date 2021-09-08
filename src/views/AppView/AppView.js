import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { colors, Divider } from '@material-ui/core';
import { Section, SectionAlternate } from 'components/organisms';
import {
  ViewAddons,
  AppSetup,
  ViewDevices,
  AddDevice,
  ManageDevice,
  AddIdentity,
  ManageIdentity,
  AddWallet,
  ManageWallet,
  AddSecureNote,
  ManageSecureNote,
  FirstDeviceSetup,
  AddCloudAddon,
  Identities,
  SecureNotes,
  Wallets,
} from './components';
import { LicenseInfo } from '@material-ui/x-grid';
import useLocalStorageState from 'use-local-storage-state';

LicenseInfo.setLicenseKey(
  'bf57be20472e85bfdfef0d081e052e6dT1JERVI6MTg2MjEsRVhQSVJZPTE2MzY1MzA2OTUwMDAsS0VZVkVSU0lPTj0x',
);

const useStyles = makeStyles(theme => ({
  pagePaddingTop: {
    paddingTop: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      paddingTop: theme.spacing(5),
    },
  },
  sectionNoPaddingTop: {
    paddingTop: 0,
  },
  shape: {
    background: theme.palette.alternate.main,
    borderBottomRightRadius: '50%',
    borderBottom: `1px solid ${colors.grey[200]}`,
  },
}));

const AppView = () => {
  const classes = useStyles();

  const [setupMode, setSetupMode] = useState(false);
  const [firstDeviceSetup, setFirstDeviceSetupMode] = useState(false);
  const [recoveryPassphrase, setRecoveryPassphrase] = useState('');
  const [importRecoveryPassphrase, setImportRecoveryPassphrase] = useState('');

  // use this component to detect persistence to warn the user if storage is in-memory or not
  const [config, setConfig, isPersistent] = useLocalStorageState('config', []);
  const [wallets, setWallets] = useLocalStorageState('wallets', []);
  const [identities, setIdentities] = useLocalStorageState('identities', []);
  const [devices, setDevices] = useLocalStorageState('devices', []);
  const [secureNotes, setSecureNotes] = useLocalStorageState('secureNotes', []);

  const [showAddDevice, setShowAddDevice] = useState(false);
  const [showAddWallet, setShowAddWallet] = useState(false);
  const [showAddIdentity, setShowAddIdentity] = useState(false);
  const [showAddSecureNote, setShowAddSecureNote] = useState(false);
  const [showAddCloudAddon, setShowAddCloudAddon] = useState(false);
  const [showManageDevice, setShowManageDevice] = useState(false);
  const [showManageWallet, setShowManageWallet] = useState(false);
  const [showManageIdentity, setShowManageIdentity] = useState(false);
  const [showManageSecureNote, setShowManageSecureNote] = useState(false);

  React.useEffect(() => {
    console.log(config);
    // if a seedHash is present, then they've set up their account already, so close the setup section
    if (config && !config.seedHash) {
      setSetupMode(true);
    }
    if (config && !config.firstDeviceSetup) {
      setFirstDeviceSetupMode(true);
    }
  }, [config]);

  return (
    <div>
      {showAddDevice && (
        <AddDevice />
      )}
      {showManageDevice && (
        <ManageDevice />
      )}
      {showAddIdentity && (
        <AddIdentity />
      )}
      {showManageIdentity && (
        <ManageIdentity />
      )}
      {showAddWallet && (
        <AddWallet />
      )}
      {showManageWallet && (
        <ManageWallet />
      )}
      {showAddSecureNote && (
        <AddSecureNote />
      )}
      {showManageSecureNote && (
        <ManageSecureNote />
      )}
      {showAddCloudAddon && (
        <AddCloudAddon />
      )}
      {setupMode && (
        <SectionAlternate>
          <AppSetup
            config={config}
            setConfig={setConfig}
            isPersistent={isPersistent}
            recoveryPassphrase={recoveryPassphrase}
            setRecoveryPassphrase={setRecoveryPassphrase}
            importRecoveryPassphrase={importRecoveryPassphrase}
            setImportRecoveryPassphrase={setImportRecoveryPassphrase}
          />
        </SectionAlternate>
      )}
      {!setupMode && firstDeviceSetup && (
        <SectionAlternate>
          <FirstDeviceSetup
            devices={devices}
            setDevices={setDevices}
            config={config}
            setShowAddDevice={setShowAddDevice}
          />
        </SectionAlternate>
      )}
      {!setupMode && !firstDeviceSetup && (
        <>
          <Section>
            <ViewIdentities
              disabled={setupMode || firstDeviceSetup}
              identities={identities}
              setIdentities={setIdentities}
              config={config}
              setShowAddIdentity={setShowAddIdentity}
              setShowManageIdentity={setShowManageIdentity}
            />
          </Section>
          <Section className={classes.sectionNoPaddingTop}>
            <ViewWallets
              disabled={setupMode || firstDeviceSetup}
              wallets={wallets}
              setWallets={setWallets}
              config={config}
              setShowAddWallet={setShowAddWallet}
              setShowManageWallet={setShowManageWallet}
            />
          </Section>
          <Section className={classes.sectionNoPaddingTop}>
            <ViewSecureNotes
              disabled={setupMode || firstDeviceSetup}
              secureNotes={secureNotes}
              setSecureNotes={setSecureNotes}
              config={config}
              setShowAddSecureNote={setShowAddSecureNote}
              setShowManageSecureNote={setShowManageSecureNote}
            />
          </Section>
          <Section className={classes.sectionNoPaddingTop}>
            <ViewDevices
              disabled={setupMode}
              devices={devices}
              setDevices={setDevices}
              config={config}
              setShowAddDevice={setShowAddDevice}
              setShowManageDevice={setShowManageDevice}
            />
          </Section>
          <Divider />
          <SectionAlternate className={classes.sectionNoPaddingTop}>
            <ViewAddons
              disabled={setupMode || firstDeviceSetup}
              setShowAddCloudAddon={setShowAddCloudAddon}
            />
          </SectionAlternate>
        </>
      )}
    </div>
  );
};

export default AppView;
