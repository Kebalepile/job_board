
import React from 'react';
import { useNavigate } from 'react-router-dom';

import  {MdHomeFilled} from 'react-icons/md'
import { MdWork} from 'react-icons/md'
import { RiMenu5Line} from 'react-icons/ri'

function useNavigation() {
  const navigateTo = useNavigate();
  function navigate(path) {
    navigateTo(path);
  }
  return navigate;
}

export default function Nav() {
  const Navigate = useNavigation();

  return (
   
      <nav className="menu">
        <button
          onClick={(e) => {
            e.preventDefault();
            Navigate("/");
          }}
          className="menu-items"
          title="Home"
        >
          <MdHomeFilled />
        </button>
        <button
          onClick={() => Navigate("/about_site")}
          className="menu-items"
          title="Menu"
        >
          <RiMenu5Line />
        </button>
        <button
          onClick={() => {
            Navigate("/job_board");
          }}
          className="menu-items"
          title="Jobs"
        >
          <MdWork />
        </button>
      </nav>
   
  );
}
