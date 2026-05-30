import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real application, this would be an API call to get user data
    const fetchUser = async () => {
      try {
        // Simulate API call
        const response = await new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              id: '123',
              name: 'John Doe',
              role: 'Frontend Developer',
              profileCompletion: 75,
              profileViews: 128,
              earningsThisMonth: 2500,
              activeProjects: [
                {
                  id: 1,
                  title: 'E-commerce Website',
                  client: 'Tech Solutions Ltd',
                  status: 'In Progress',
                  dueDate: '2024-03-15'
                },
                {
                  id: 2,
                  title: 'Mobile App UI',
                  client: 'Innovation Corp',
                  status: 'Review',
                  dueDate: '2024-03-20'
                }
              ],
              recentEarnings: [
                {
                  id: 1,
                  project: 'Brand Design',
                  amount: 800,
                  date: '2024-02-28'
                },
                {
                  id: 2,
                  title: 'Web Development',
                  amount: 1200,
                  date: '2024-02-25'
                }
              ]
            });
          }, 1000);
        });
        setUser(response);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const updateUser = (newData) => {
    setUser(prev => ({ ...prev, ...newData }));
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, loading, updateUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext; 