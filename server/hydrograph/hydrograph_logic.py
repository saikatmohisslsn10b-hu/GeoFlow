import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.ticker as ticker
import dataretrieval.nwis as nwis
import warnings

warnings.filterwarnings("ignore")
plt.rcParams["font.family"] = "Times New Roman"
plt.rcParams["axes.titlesize"] = 18
plt.rcParams["axes.labelsize"] = 16
plt.rcParams["xtick.labelsize"] = 13
plt.rcParams["ytick.labelsize"] = 13
plt.rcParams["legend.fontsize"] = 11

def extract_event(df, peak_idx, window):
    start_idx = peak_idx - window
    end_idx = peak_idx + window
    if start_idx < 0 or end_idx >= len(df):
        return None
    event = df.iloc[start_idx:end_idx + 1].copy()
    event["RelativeHour"] = np.arange(-window, window + 1)
    return event

def find_top_events(df, n_events=5, window=72):
    temp_df = df.copy()
    events = []
    for _ in range(n_events):
        if temp_df["Discharge_CFS"].isna().all():
            break
        peak_idx = temp_df["Discharge_CFS"].idxmax()
        event = extract_event(df, peak_idx, window)
        if event is not None:
            peak_time = df.loc[peak_idx, "DateTime"]
            events.append({
                "event": event,
                "peak_time": peak_time
            })
        start_remove = max(0, peak_idx - window)
        end_remove = min(len(temp_df) - 1, peak_idx + window)
        temp_df.loc[start_remove:end_remove, "Discharge_CFS"] = np.nan
    return events

def generate_hydrograph(station_code, output_png, title):
    window_hours = 72 # HARDCODED FOR PERFECT WIDE CURVES
    
    start_date = "1976-01-01"
    end_date = "2026-01-01"
    parameter_code = "00060" # Discharge (cfs)
    
    df, md = nwis.get_iv(sites=station_code, parameterCd=parameter_code, start=start_date, end=end_date)
    
    if df.empty:
        raise ValueError(f"No data available for station {station_code}.")
        
    df = df.reset_index()
    flow_cols = [c for c in df.columns if "00060" in c and not c.endswith("_cd")]
    if len(flow_cols) == 0:
        raise ValueError(f"Discharge column not found for station {station_code}.")
        
    flow_col = flow_cols[0]
    df = df[["datetime", flow_col]]
    df.columns = ["DateTime", "Discharge_CFS"]
    
    df["DateTime"] = pd.to_datetime(df["DateTime"], utc=True, errors="coerce")
    df["Discharge_CFS"] = pd.to_numeric(df["Discharge_CFS"], errors="coerce")
    df = df.dropna()
    
    df = df.set_index("DateTime").resample("1h").mean().reset_index()
    df = df.dropna().reset_index(drop=True)
    
    top_events = find_top_events(df, n_events=5, window=window_hours)
    
    if not top_events:
        raise ValueError("Not enough valid data to extract events.")
        
    mean_events = []
    for e in top_events:
        arr = e["event"]["Discharge_CFS"].values
        if len(arr) == (2 * window_hours + 1):
            mean_events.append(arr)
            
    mean_hydrograph = None
    if len(mean_events) > 0:
        mean_hydrograph = np.mean(np.array(mean_events), axis=0)

    fig, ax = plt.subplots(figsize=(14, 8))
    colors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd"]
    
    for i, item in enumerate(top_events):
        event = item["event"]
        peak_time = item["peak_time"]
        ax.plot(event["RelativeHour"], event["Discharge_CFS"], linewidth=2, 
                color=colors[i % len(colors)], label=f"Event: {peak_time.strftime('%Y-%m-%d %H:%M')}")
                
    if mean_hydrograph is not None:
        ax.plot(np.arange(-window_hours, window_hours + 1), mean_hydrograph, color="black", 
                linestyle="--", linewidth=4, label="Mean Hydrograph")
                
    ax.axvline(x=0, color="red", linestyle=":", linewidth=2)
    
    ax.set_title(title, fontweight="bold")
    ax.set_xlabel("Time in Hours", fontweight="bold")
    ax.set_ylabel("Peak Discharge (ft³/s)", fontweight="bold")
    ax.set_xlim(-window_hours, window_hours)
    
    tick_interval = 12
    ax.set_xticks(np.arange(-window_hours, window_hours + 1, tick_interval))
    
    ax.grid(True, linestyle=":", alpha=0.5)
    ax.legend(loc="upper right", frameon=True, fancybox=True, shadow=False)
    
    plt.tight_layout()
    plt.savefig(output_png, dpi=600, bbox_inches="tight")
    plt.close(fig)
    return True