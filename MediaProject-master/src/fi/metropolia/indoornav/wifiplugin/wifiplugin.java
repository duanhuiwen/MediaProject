package fi.metropolia.indoornav.wifiplugin;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.cordova.api.Plugin;
import org.apache.cordova.api.PluginResult;
import org.apache.cordova.api.PluginResult.Status;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.net.wifi.ScanResult;
import android.net.wifi.WifiManager;



public class wifiplugin extends Plugin {
	private static class ScanBean {
		public long found;
		public ScanResult result;
		
		public ScanBean(ScanResult result, long found) {
			this.result = result;
			this.found = found;
		}
	}
	
	private static final String START = "start";
	private static final String GET = "get";

	private WifiManager wm;
	
	//private String lastResult = "";
	
	private Map<String, ScanBean> list = new HashMap<String, ScanBean>();
	
	private BroadcastReceiver bc = new BroadcastReceiver() {
		@Override
		public void onReceive(Context context, Intent intent) {
			
			List<ScanResult> wifiList = wm.getScanResults();
			
			for (ScanResult result : wifiList) {
				list.put(result.BSSID, new ScanBean(result, System.currentTimeMillis()));
			}
			// System.out.println("Scans " + wifiList.size() + ", " + list.size());
			
			wm.startScan();
		}
	};
	
	private String getResult() {
		StringBuilder sb = new StringBuilder();
		Iterator<ScanBean> itr = list.values().iterator();
		long now = System.currentTimeMillis();
		while(itr.hasNext()) {
			ScanBean b = itr.next();
			if (b.found > now - 5000) {
				ScanResult result = b.result;
				sb.append("" + result.BSSID + "/" + result.SSID + "/"
						+ result.frequency + "/" + result.level + ",");
			} else {
				itr.remove();
			}
		}
		return sb.toString();
	}
	
	@Override
	public PluginResult execute(String arg0, JSONArray arg1, String arg2) {
		if (arg0.equals(START)) {
			wm = (WifiManager)ctx.getSystemService(Service.WIFI_SERVICE);
			wm.setWifiEnabled(true);
			ctx.registerReceiver(bc, new IntentFilter(WifiManager.SCAN_RESULTS_AVAILABLE_ACTION));
			wm.startScan();
			
			return new PluginResult(Status.OK);
		} else if (arg0.equals(GET)) {
			return new PluginResult(Status.OK, getResult());
		} else {
			return new PluginResult(Status.INVALID_ACTION);
		}

	}

}