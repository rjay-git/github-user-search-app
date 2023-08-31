import React, { useState } from 'react';
import { 
  Accordion,
  AccordionDetails,
  AccordionSummary, 
  Button, 
  Card,
  CardContent, 
  TextField 
  } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface User {
  id: number;
  login: string;
  repositories: Repository[];
}

interface Repository {
  id: number;
  name: string;
  description: string;
  watchers: number;
}

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `https://api.github.com/search/users?q=${searchTerm}&per_page=5`
      );
      const data = await response.json();
      if (data.items) {
        const fetchedUsers: User[] = await Promise.all(
          data.items.map(async (item: any) => {
            const response = await fetch(`https://api.github.com/users/${item.login}/repos`);
            const data = await response.json();
            return { id: item.id, login: item.login, repositories: data };
          }
        ));
        setUsers(fetchedUsers);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  return (
    <div style={{display: 'flex', flexDirection: 'column', margin: '1.5em auto', maxWidth: 600, padding: '0px 1.5em'}}>
      <TextField 
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
        id="outlined-basic"
        type='text'
        label="Enter username"
        value={searchTerm}
        variant="outlined"
      />
      <br />
      <Button variant="contained" onClick={handleSearch}>Search</Button>
      <div>
        {users.map((user) => (
          <Accordion key={user.id}>
            <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            >
              {user.login}
            </AccordionSummary>
              <AccordionDetails>
                { user.repositories.length > 1 ? user.repositories.map((repo: Repository) => (
                  <Card key={repo.id} style={{backgroundColor: '#CCCCCC', marginBottom: '25px'}}>
                    <CardContent>
                      <h3>{repo.name}</h3>
                      <h5>{repo.description}</h5>
                      <p>Watchers: {repo.watchers}</p>
                    </CardContent>
                  </Card>
                )): `This user dont have any repositories showed`}
              </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </div>
  );
};

export default App;
