import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { colors, Divider } from '@material-ui/core';
import { Section, SectionAlternate } from 'components/organisms';
import {
  Download,
  Hero,
  SubHero,
  Token,
  Pricings,
  OpenSource,
} from './components';

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

const IndexView = () => {
  const classes = useStyles();

  return (
    <div>
      <div className={classes.shape}>
        <Section className={classes.pagePaddingTop}>
          <Hero />
        </Section>
        <Section className={classes.sectionNoPaddingTop}>
          <SubHero />
        </Section>
      </div>
      <Section narrow>
        <OpenSource data={{ items: [], team: [] }} />
      </Section>
      <SectionAlternate>
        <Token />
      </SectionAlternate>
      <Section innerNarrowed>
        <Pricings />
      </Section>
      <Section>
        <Download data={[]} />
      </Section>
      <Divider />
    </div>
  );
};

export default IndexView;
