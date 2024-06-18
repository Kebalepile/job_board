import React,{ useReducer } from "react";
import JobBoardContext from "./context";
import PropTypes from "prop-types";
import Reducer from "./reducer";
import { AGENCYICONS, POSTINFO } from "../types";

import { data as propersonnelData } from "../../backend/database/private/Pro-Personnel";
import { data as heithaData } from "../../backend/database/private/heitha-stuffing-group";
import { data as minopexData } from "../../backend/database/private/minopex";
import { data as privateSectorData } from "../../backend/database/public/govpage-private-sector";
import { data as publicSectorData } from "../../backend/database/public/govpage-public-sector";
import { data as saYouthData } from "../../backend/database/private/SA-Youth";

export default function JobBoardProvider({ children }) {
  const initialState = {
    PostInfo: null,
    AgencyIcons: [
      {
        src: `./assets/${saYouthData["iconLink"]}`,
        title: saYouthData["title"]
      },
      {
        src: `./assets/${minopexData["iconLink"]}`,
        title: minopexData["title"]
      },
      {
        src: `./assets/${propersonnelData["iconLink"]}`,
        title: propersonnelData["title"]
      },
      {
        src: `./assets/${heithaData["iconLink"]}`,
        title: heithaData["title"]
      }
    ]
  };
  const [state, dispatch] = useReducer(Reducer, initialState);
  const { AgencyIcons, PostInfo } = state;

  const AddAgencyIcons = () => {
    dispatch({
      type: AGENCYICONS,
      payload: {
        AgencyIcons: [
          {
            src: `../../backend/database/${minopexData["iconLink"]}`,
            title: minopexData["title"]
          },
          {
            src: `../../backend/database/${propersonnelData["iconLink"]}`,
            title: propersonnelData["title"]
          },
          {
            src: `../../backend/database/${heithaData["iconLink"]}`,
            title: heithaData["title"]
          },
          {
            src: `../../backend/database/${saYouthData["iconLink"]}`,
            title: saYouthData["title"]
          }
        ]
      }
    });
  };

  const PublicJobs = () => {
    return publicSectorData;
  };

  const PrivateJobs = () => {
    return privateSectorData;
  };

  const OtherPrivateJobs = () => {
    return [
      ...saYouthData.blogPosts,
      ...minopexData.blogPosts,
      ...propersonnelData.blogPosts,
      ...heithaData.blogPosts
    ];
  };
  const PropersonnelJobs = () => {
    return propersonnelData;
  };
  const HeithaJobs = () => {
    return heithaData;
  };
  const MinopexJobs = () => {
    return minopexData;
  };
  const SAYouthJobs = () => {
    return saYouthData;
  };
  const Hiring = () => {
    return {
      public: PublicJobs().blogPosts.length || 0,
      private: OtherPrivateJobs().length || 0,
      bigPrivate: PrivateJobs().blogPosts.length || 0
    };
  };
  const ReadMore = (info) => {
    dispatch({ type: POSTINFO, payload: { PostInfo: info } });
  };
  return (
    <JobBoardContext.Provider
      value={{
        PostInfo,
        AgencyIcons,
        Hiring,
        AddAgencyIcons,
        PublicJobs,
        PrivateJobs,
        OtherPrivateJobs,
        MinopexJobs,
        PropersonnelJobs,
        SAYouthJobs,
        HeithaJobs,
        ReadMore
      }}
    >
      {children}
    </JobBoardContext.Provider>
  );
}

JobBoardProvider.propTypes = {
  children: PropTypes.node.isRequired
};
