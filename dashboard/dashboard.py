import streamlit as st
import pandas as pd
from sqlalchemy import create_engine

DATABASE_URL = ("postgresql://postgres:%407EKK8TL5@localhost:5433/flashlink")
engine = create_engine(DATABASE_URL)
st.set_page_config(page_title="FlashLink Analytics",layout="wide")
st.title("FlashLink Analytics Dashboard")

urls_df = pd.read_sql("SELECT * FROM urls",engine)
analytics_df = pd.read_sql("SELECT * FROM analytics_events",engine)
col1, col2, col3 = st.columns(3)
with col1:
    st.metric("Total URLs",len(urls_df))

with col2:
    st.metric("Total Click Events",len(analytics_df))

with col3:
    st.metric("Unique Visitors",analytics_df["ip_address"].nunique()
        if not analytics_df.empty else 0
    )

st.subheader("Clicks Per Short URL")
if not analytics_df.empty:
    clicks_per_url = (
        analytics_df.groupby("short_code")
        .size()
        .reset_index(name="clicks")
    )
    st.bar_chart(
        clicks_per_url.set_index("short_code")
    )

st.subheader("Recent Analytics Events")
if not analytics_df.empty:
    analytics_df = analytics_df.sort_values(
        by="id",
        ascending=False
    )
st.dataframe(analytics_df,use_container_width=True)
st.subheader("URLs")
st.dataframe(urls_df,use_container_width=True)