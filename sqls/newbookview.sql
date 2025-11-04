CREATE OR REPLACE VIEW newest_bookcopies AS
SELECT 
  t.ISBN,
  t.Title,
  STRING_AGG(a.Name, ', ') AS Authors
FROM (
  SELECT DISTINCT ON (bc.ISBN)
    bc.ISBN,
    b.Title,
    bc.AcquisitionDate
  FROM BookCopy bc
  JOIN Book b ON b.ISBN = bc.ISBN
  ORDER BY bc.ISBN, bc.AcquisitionDate DESC NULLS LAST, bc.CopyID DESC
) t
JOIN BookAuthor ba ON ba.ISBN = t.ISBN
JOIN Author a ON a.AuthorID = ba.AuthorID
GROUP BY t.ISBN, t.Title, t.AcquisitionDate
ORDER BY t.AcquisitionDate DESC NULLS LAST
LIMIT 5;