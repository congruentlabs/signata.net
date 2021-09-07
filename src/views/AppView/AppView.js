import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { colors, Divider } from '@material-ui/core';
import { Section, SectionAlternate } from 'components/organisms';
import {
  Identities,
  Wallets,
  SecureNotes,
  Devices,
  Addons,
  AppSetup,
  FirstDeviceSetup,
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

  const [setupMode, setSetupMode] = React.useState(false);
  const [firstDeviceSetup, setFirstDeviceSetupMode] = React.useState(false);
  const [config, setConfig, isPersistent] = useLocalStorageState('config', []);
  const [wallets, setWallets] = useLocalStorageState('wallets', []);
  const [identities, setIdentities] = useLocalStorageState('identities', []);
  const [devices, setDevices] = useLocalStorageState('devices', []);
  const [secureNotes, setSecureNotes] = useLocalStorageState('secureNotes', []);

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
      {setupMode && (
        <SectionAlternate>
          <AppSetup
            config={config}
            setConfig={setConfig}
            isPersistent={isPersistent}
          />
        </SectionAlternate>
      )}
      {!setupMode && firstDeviceSetup && (
        <SectionAlternate>
          <FirstDeviceSetup
            devices={devices}
            setDevices={setDevices}
            config={config}
          />
        </SectionAlternate>
      )}
      {!setupMode && !firstDeviceSetup && (
        <>
          <Section>
            <Identities
              disabled={setupMode || firstDeviceSetup}
              identities={identities}
              setIdentities={setIdentities}
              config={config}
            />
          </Section>
          <Section className={classes.sectionNoPaddingTop}>
            <Wallets
              disabled={setupMode || firstDeviceSetup}
              wallets={wallets}
              setWallets={setWallets}
              config={config}
            />
          </Section>
          <Section className={classes.sectionNoPaddingTop}>
            <SecureNotes
              disabled={setupMode || firstDeviceSetup}
              secureNotes={secureNotes}
              setSecureNotes={setSecureNotes}
              config={config}
            />
          </Section>
          <Section className={classes.sectionNoPaddingTop}>
            <Devices
              disabled={setupMode}
              devices={devices}
              setDevices={setDevices}
              config={config}
            />
          </Section>
          <Divider />
          <SectionAlternate className={classes.sectionNoPaddingTop}>
            <Addons
              disabled={setupMode || firstDeviceSetup}
            />
          </SectionAlternate>
        </>
      )}
    </div>
  );
};

export default AppView;
