import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useState } from 'react';
import { BiSolidUpArrow, BiSolidDownArrow } from 'react-icons/bi';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    fontSize:'20px',
    border: 'none',
    textAlign: 'center',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: "16px",
    border: 'none',
    textAlign: 'center',
  },
}));
const StyledTableRow = styled(TableRow)(({ theme }) => ({}));

export default function CustomizedTables({ headNames, rows, setSortValue, setSorting }) {
  const [sortingState, setSortingState] = useState({ index: null, direction: 'asc' });

  const handleSort = (index) => {
    const isSameColumn = sortingState.index === index;
    const newDirection = isSameColumn && sortingState.direction === 'asc' ? 'desc' : 'asc';
    setSortingState({ index, direction: newDirection });
    setSortValue(index + 1);
    setSorting(prev => !prev);
  };

  return (
    <TableContainer component={Paper} className='poppins-regular' style={{ boxShadow: '0px solid ', minHeight: '325px' }}>
      <Table
        sx={{
          minWidth: 700,
          borderSpacing: '10px 0px', 
          border: 'none', 
        }}
        aria-label="customized table"
        className='manage-table'
      >
        <TableHead>
          <TableRow>
            {headNames.map((header, index) => (
              <StyledTableCell key={index} align="center">
                <p className="p-3 rounded bg_dede w-100 mb-0 poppins-bold" style={{ fontSize: '0.8rem' }}>
                  {header}
                  {header !== 'Action' && (
                    <span className='mx-2 cursor-pointer' onClick={() => handleSort(index)}>
                      {sortingState.index === index && sortingState.direction === 'asc' ? (
                        <BiSolidDownArrow color='gray' />
                      ) : (
                        <BiSolidUpArrow color='gray' />
                      )}
                    </span>
                  )}
                </p>
              </StyledTableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row, index) => (
            <StyledTableRow key={index}>
              
              {Object.values(row).map((value, i) => (
                <StyledTableCell key={i} align="center" className='poppins-thin'>
                  {value}
                </StyledTableCell>
              ))}
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
