import { gqlFetch } from "./fetchGraphQL";


export const Q_USER = /* GraphQL */ `
  query {
    user {
      id
      login
      email
      firstName
      lastName
      dateOfBirth: attrs(path: "dateOfBirth")
    }
  }
`;

export const Q_XP = /* GraphQL */ `
  query {
    transaction_aggregate(
      where: {
        event: { path: { _eq: "/bahrain/bh-module" } }
        type: { _eq: "xp" }
      }
    ) {
      aggregate {
        sum { amount }
      }
    }
  }
`;

export const Q_LEVEL = /* GraphQL */ `
  query ($username: String) {
    event_user(
      where: {
        userLogin: { _eq: $username }
        event: { path: { _eq: "/bahrain/bh-module" } }
      }
    ) {
      level
    }
  }
`;

export const Q_AUDIT = /* GraphQL */ `
  query {
    user {
      id
      auditRatio
      totalUp
      totalDown
    }
  }
`;

export const Q_PROJECTS = /* GraphQL */ `
  query {
    transaction(
      where: {
        type: { _eq: "xp" }
        event: { path: { _eq: "/bahrain/bh-module" } }
        object: { object_type: { type: { _eq: "project" } } }
      }
      order_by: { createdAt: asc }
    ) {
      amount
      path
      createdAt
      object { name object_type { type } }
    }
  }
`;

export const Q_SKILLS = /* GraphQL */ `
  query ($username: String) {
    user(where: { login: { _eq: $username } }) {
      transactions(
        where: {
          _and: [
            { type: { _like: "%skill%" } }
            { object: { type: { _eq: "project" } } }
            { type: {
                _in: [
                  "skill_go","skill_js","skill_html",
                  "skill_css","skill_unix","skill_sql","skill_algo"
                ]
              }
            }
          ]
        }
        order_by: [{ type: asc }, { createdAt: desc }]
        distinct_on: type
      ) {
        createdAt amount type path
      }
    }
  }
`;

export const Q_PASS = /* GraphQL */ `
  query {
    user {
      audits_aggregate(where: { grade: { _gte: 1 } }) {
        aggregate { count }
      }
    }
  }
`;

export const Q_FAIL = /* GraphQL */ `
  query {
    user {
      audits_aggregate(where: { grade: { _lt: 1 } }) {
        aggregate { count }
      }
    }
  }
`;

export interface UserData {
  id: number;
  login: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string | null;

  xp: number | null;
  level: number | null;

  totalUp: number | null;
  totalDown: number | null;
  auditRatio: number | null;

  passCount: number | null;
  failCount: number | null;

  skills: any[];
  projects: any[];
}


export const fetchUserData = async (
  token: string
): Promise<UserData | { error: string }> => {
  try {
    const userRes = await gqlFetch(Q_USER, {}, token);
    const me = userRes?.user?.[0];
    if (!me) return { error: "No user record found" };

    const [
      xpRes,
      levelRes,
      auditRes,
      passRes,
      failRes,
      skillsRes,
      projectsRes,
    ] = await Promise.all([
      gqlFetch(Q_XP, {}, token),
      gqlFetch(Q_LEVEL, { username: me.login }, token),
      gqlFetch(Q_AUDIT, {}, token),
      gqlFetch(Q_PASS, {}, token),
      gqlFetch(Q_FAIL, {}, token),
      gqlFetch(Q_SKILLS, { username: me.login }, token),
      gqlFetch(Q_PROJECTS, {}, token),
    ]);

    return {
      ...me,
      xp: xpRes?.transaction_aggregate?.aggregate?.sum?.amount ?? null,
      level: levelRes?.event_user?.[0]?.level ?? null,

      totalUp: auditRes?.user?.[0]?.totalUp ?? null,
      totalDown: auditRes?.user?.[0]?.totalDown ?? null,
      auditRatio: auditRes?.user?.[0]?.auditRatio ?? null,

      passCount: passRes?.user?.[0]?.audits_aggregate?.aggregate?.count ?? null,
      failCount: failRes?.user?.[0]?.audits_aggregate?.aggregate?.count ?? null,

      skills: skillsRes?.user?.[0]?.transactions ?? [],
      projects: projectsRes?.transaction ?? [],
    };
  } catch (err) {
    console.error("fetchUserData error:", err);
    return { error: "Unable to fetch user data" };
  }
};
