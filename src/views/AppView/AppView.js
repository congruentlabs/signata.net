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
  Setup,
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
  const [config, setConfig, isPersistent] = useLocalStorageState('config', []);
  const [initialSetup, setInitialSetup] = React.useState(false);

  React.useEffect(() => {
    console.log(config);
    if (!config || config.length < 1) {
      setSetupMode(true);
    }
  }, [config]);

  return (
    <div>
      {setupMode && (
        <SectionAlternate>
          <Setup
            config={config}
            setConfig={setConfig}
            isPersistent={isPersistent}
          />
        </SectionAlternate>
      )}
      <Section>
        <Identities
          disabled={setupMode}
        />
      </Section>
      <Section className={classes.sectionNoPaddingTop}>
        <Wallets
          disabled={setupMode}
        />
      </Section>
      <Section className={classes.sectionNoPaddingTop}>
        <SecureNotes
          disabled={setupMode}
        />
      </Section>
      <Section className={classes.sectionNoPaddingTop}>
        <Devices
          disabled={setupMode}
        />
      </Section>
      <Divider />
      <SectionAlternate className={classes.sectionNoPaddingTop}>
        <Addons
          disabled={setupMode}
        />
      </SectionAlternate>
    </div>
  );
};

export default AppView;
