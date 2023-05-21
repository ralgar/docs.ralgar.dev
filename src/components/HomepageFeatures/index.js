import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Infrastructure as Code',
    Svg: require('@site/static/img/monitor-coding-svgrepo-com.svg').default,
    description: (
      <>
        Define infrastructure resources as code, keeping it documented,
        reproducible, and version controlled. This allows you and your team
        to...
      </>
    ),
  },
  {
    title: 'Focus on What Matters',
    Svg: require('@site/static/img/infinity-svgrepo-com.svg').default,
    description: (
      <>
        The DevOps process lets you focus on making continual, iterative
        improvements in automated, reproducible environment. This in
        turn leads to...
      </>
    ),
  },
  {
    title: 'Better Operations',
    Svg: require('@site/static/img/servers-svgrepo-com.svg').default,
    description: (
      <>
        Reproducible, scalable, and secure. Automation and continuous code
        improvements lead to a better operations experience. What's not to love?
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
