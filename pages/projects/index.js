import React from 'react';
import Link from 'next/link';
import styles from '@/styles/PageTitle.module.css'
import ErrorWrapper from '@/components/Projects/AllProjects/ErrorWrapper';

const Projects = () => {
  return (
    <>
      {/* Page title */}
      <div className={styles.pageTitle}>
        <h1>Projects</h1>
        <ul>
          <li>
            <Link href="/">Dashboard</Link>
          </li>
          <li>Projects</li>
        </ul>
      </div>

      <ErrorWrapper />
    </>
  )
}

export default Projects;