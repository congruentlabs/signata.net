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
} from './components';
import { LicenseInfo } from '@material-ui/x-grid';

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

  return (
    <div>
      <Section>
        <Identities />
      </Section>
      <Section className={classes.sectionNoPaddingTop}>
        <Wallets />
      </Section>
      <Section className={classes.sectionNoPaddingTop}>
        <SecureNotes />
      </Section>
      <Section className={classes.sectionNoPaddingTop}>
        <Devices />
      </Section>
      <Divider />
      <SectionAlternate className={classes.sectionNoPaddingTop}>
        <Addons />
      </SectionAlternate>
    </div>
  );
};

export default AppView;
