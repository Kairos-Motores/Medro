// src/features/report-builder/components/PaginatedPage.jsx
import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const PaginatedPage = ({ 
  pageNumber, 
  title, 
  unidade, 
  cliente, 
  children 
}) => (
  <div className="page a4-page">
    <Header unidade={unidade} cliente={cliente} titulo={title} />
    <main className="page-body">{children}</main>
    <Footer pageNumber={pageNumber} unidade={unidade} />
  </div>
);